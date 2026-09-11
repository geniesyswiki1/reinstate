import { useCallback, useEffect, useState } from 'react';
import { ScrollView, TextInput, View, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useShareIntent } from 'expo-share-intent';
import {
  getCaseType,
  priceForCaseType,
  tierForPlatform,
  PLATFORM_LABELS,
  type ClassifyResult,
} from '@reinstate/shared';
import { api } from '@/lib/api';
import { addCase, listCases } from '@/lib/store';
import { Body, Button, Heading, Muted, Notice, Rule } from '@/components/ui';
import { colors, fonts, radius, space, type } from '@/lib/theme';
import Paywall from '@/components/Paywall';

/** Screen 1, section 12.5. Classification runs free, before any paywall. */
export default function Start() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClassifyResult | null>(null);
  const [hasCases, setHasCases] = useState(false);
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntent();

  useEffect(() => {
    void listCases().then((cases) => setHasCases(cases.length > 0));
  }, []);

  // Shared from Mail: the notice text arrives straight into the box.
  useEffect(() => {
    if (hasShareIntent && shareIntent.text) {
      setText(shareIntent.text);
      resetShareIntent();
    }
  }, [hasShareIntent, shareIntent, resetShareIntent]);

  const classify = useCallback(
    async (file?: { media_type: string; data: string }) => {
      if (!text.trim() && !file) {
        setError('We need the suspension notice to classify your case. Paste the email text or photograph it.');
        return;
      }
      setBusy(true);
      setError(null);
      setResult(null);
      try {
        const res = await api.classify({ notice_text: text, file });
        if (!res.case_type) {
          setError(
            res.note ??
              'That does not look like a suspension notice. Send the full email, including the part that says what the problem is.',
          );
        } else {
          setResult(res);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'That did not work. Try again.');
      } finally {
        setBusy(false);
      }
    },
    [text],
  );

  const photograph = useCallback(async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setError('Reinstate needs the camera to photograph the notice. Enable it in Settings, or paste the text instead.');
      return;
    }
    const shot = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7 });
    if (shot.canceled || !shot.assets[0]?.base64) return;
    await classify({ media_type: shot.assets[0].mimeType ?? 'image/jpeg', data: shot.assets[0].base64 });
  }, [classify]);

  const pick = useCallback(async () => {
    const shot = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.7 });
    if (shot.canceled || !shot.assets[0]?.base64) return;
    await classify({ media_type: shot.assets[0].mimeType ?? 'image/jpeg', data: shot.assets[0].base64 });
  }, [classify]);

  const caseType = getCaseType(result?.case_type);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Heading>Your account was deactivated. Here is exactly what to send back.</Heading>

      <View style={{ height: space.lg }} />
      <Muted>Paste or photograph your deactivation notice. Nothing is stored until you start a case.</Muted>

      <TextInput
        style={styles.field}
        multiline
        value={text}
        onChangeText={setText}
        editable={!busy}
        placeholder="We are writing to inform you that your Amazon selling account has been deactivated..."
        placeholderTextColor={colors.muted}
      />

      <View style={styles.actions}>
        <Button label={busy ? 'Reading the notice...' : 'Classify my notice'} onPress={() => classify()} disabled={busy} />
        <Button label="Photograph it" variant="secondary" onPress={photograph} disabled={busy} />
        <Button label="Choose a photo" variant="secondary" onPress={pick} disabled={busy} />
      </View>

      {error ? (
        <View style={{ marginTop: space.md }}>
          <Notice>{error}</Notice>
        </View>
      ) : null}

      {result && caseType ? (
        <>
          <Rule />
          <Body>
            This is a {caseType.name.toLowerCase()}. {PLATFORM_LABELS[caseType.platform]} will expect{' '}
            {(result.evidence_expected.length
              ? result.evidence_expected
              : caseType.evidence.filter((e) => e.required).map((e) => e.label.toLowerCase())
            ).join(', ')}
            .
          </Body>
          <View style={{ height: space.sm }} />
          <Muted>Deadline in the notice: {result.deadline ?? 'none stated'}.</Muted>

          <Paywall
            tier={tierForPlatform(caseType.platform)}
            price={priceForCaseType(caseType.id).display}
            classificationId={result.classification_id}
            onPurchased={async (token) => {
              await addCase({
                token,
                caseTypeId: caseType.id,
                platform: caseType.platform,
                createdAt: new Date().toISOString(),
              });
              router.push(`/case/${token}/intake`);
            }}
          />
        </>
      ) : null}

      <Rule />
      <Button
        label={hasCases ? 'Open your cases' : 'I already have a case'}
        variant="secondary"
        onPress={() => router.push('/cases')}
      />
      <View style={{ height: space.md }} />
      <Muted>
        Reinstate helps you write your own appeal. It is not legal advice and does not guarantee reinstatement.
      </Muted>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.sheet },
  content: { padding: space.lg, paddingBottom: space.xl * 2 },
  field: {
    marginTop: space.md,
    minHeight: 160,
    borderWidth: 1,
    borderColor: colors.rule,
    borderRadius: radius.control,
    backgroundColor: colors.white,
    padding: space.md,
    color: colors.ink,
    fontFamily: Platform.select(fonts.serif),
    fontSize: 16,
    textAlignVertical: 'top',
  },
  actions: { marginTop: space.md, gap: space.sm },
});
