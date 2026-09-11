import { useCallback, useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Share, Platform, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { getCaseType, type PreCheckReport } from '@reinstate/shared';
import { api, API_BASE_URL } from '@/lib/api';
import { registerForDraftNotifications, notifyDraftReady } from '@/lib/notifications';
import { Body, Button, Heading, Muted, Notice, Rule } from '@/components/ui';
import { colors, fonts, space, type } from '@/lib/theme';
import PreCheckSheet from '@/components/PreCheckSheet';
import OutcomeControl from '@/components/OutcomeControl';

/** Screen 5, section 12.5. Serif rendering, pre-check as a bottom sheet. */
export default function DraftScreen() {
  const { token, caseType: caseTypeId } = useLocalSearchParams<{ token: string; caseType?: string }>();
  const caseType = getCaseType(caseTypeId ?? null);

  const [body, setBody] = useState<{ md: string; txt: string; version: number } | null>(null);
  const [report, setReport] = useState<PreCheckReport | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refusal, setRefusal] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const write = useCallback(async () => {
    setBusy(true);
    setError(null);
    setRefusal(null);
    try {
      const result = await api.draft(token);
      if ('refused' in result) {
        setRefusal(result.message);
        return;
      }
      setBody({ md: result.draft.body_md, txt: result.draft.body_txt, version: result.draft.version });
      setReport(null);

      const reviewed = await api.review(token);
      setReport(reviewed.report);
      await notifyDraftReady(reviewed.report.blocking_count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The draft did not complete. Try again.');
    } finally {
      setBusy(false);
    }
  }, [token]);

  // Drafting takes a minute, so ask for notifications at the moment it is relevant.
  useEffect(() => {
    if (busy) void registerForDraftNotifications();
  }, [busy]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        {body ? (
          <>
            <Muted>Version {body.version}</Muted>
            <View style={{ height: space.sm }} />
            {body.md
              .split('\n')
              .filter((l) => l.trim())
              .map((line, i) =>
                line.trim().startsWith('#') ? (
                  <Text key={i} style={styles.docHeading}>
                    {line.replace(/^#{1,6}\s*/, '')}
                  </Text>
                ) : (
                  <Text key={i} style={styles.docBody}>
                    {line.trim()}
                  </Text>
                ),
              )}
          </>
        ) : (
          <>
            <Heading level={2}>Your appeal</Heading>
            <View style={{ height: space.sm }} />
            <Muted>
              We write it from your answers and the documents you confirmed. Anything missing shows up as a gap,
              and the pre-check blocks on it.
            </Muted>
          </>
        )}

        {refusal ? (
          <View style={styles.refusal}>
            <Body>{refusal}</Body>
          </View>
        ) : null}

        {error ? (
          <View style={{ marginTop: space.md }}>
            <Notice>{error}</Notice>
          </View>
        ) : null}

        <Rule />
        <View style={{ gap: space.sm }}>
          <Button label={busy ? 'Writing...' : body ? 'Redraft' : 'Write my Plan of Action'} onPress={write} disabled={busy} />
          {body ? (
            <>
              <Button
                label="Copy as text"
                variant="secondary"
                onPress={() => Clipboard.setStringAsync(body.txt)}
              />
              <Button
                label="Share DOCX"
                variant="secondary"
                onPress={() =>
                  Share.share({
                    message: `${api.docxUrl(token)}`,
                    url: api.docxUrl(token),
                    title: 'Your Plan of Action',
                  })
                }
              />
            </>
          ) : null}
        </View>

        {caseType && body ? (
          <>
            <Rule />
            <Heading level={2}>How to submit it</Heading>
            <View style={{ height: space.sm }} />
            <Body>{caseType.submission.where}</Body>
            <View style={{ height: space.sm }} />
            {caseType.submission.steps.map((step, i) => (
              <Body key={i}>
                {i + 1}. {step}
              </Body>
            ))}
            <View style={{ height: space.sm }} />
            <Muted>{caseType.submission.turnaround}</Muted>
          </>
        ) : null}

        {body ? <OutcomeControl token={token} /> : null}

        <View style={{ height: space.xl }} />
        <Muted>
          Reinstate helps you write your own appeal. It is not legal advice and does not guarantee reinstatement.
        </Muted>
        <View style={{ height: 80 }} />
      </ScrollView>

      {report ? (
        <PreCheckSheet report={report} open={sheetOpen} onToggle={() => setSheetOpen((o) => !o)} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.sheet },
  content: { padding: space.lg, paddingBottom: space.xl * 2 },
  docHeading: {
    fontFamily: Platform.select(fonts.serif),
    fontSize: 20,
    fontWeight: '600',
    color: colors.ink,
    marginTop: space.lg,
    marginBottom: space.sm,
  },
  docBody: {
    fontFamily: Platform.select(fonts.serif),
    fontSize: 17,
    lineHeight: 27,
    color: colors.ink,
    marginBottom: space.sm,
  },
  refusal: {
    marginTop: space.md,
    borderLeftWidth: 2,
    borderLeftColor: colors.notice,
    paddingLeft: space.md,
  },
});
