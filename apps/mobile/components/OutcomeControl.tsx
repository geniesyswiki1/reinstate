import { useState } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import type { OutcomeResult } from '@reinstate/shared';
import { api } from '@/lib/api';
import { Button, Heading, Muted, Notice } from '@/components/ui';
import { colors, radius, space, type } from '@/lib/theme';

export default function OutcomeControl({ token }: { token: string }) {
  const [result, setResult] = useState<OutcomeResult | null>(null);
  const [rejection, setRejection] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function record(next: OutcomeResult, text?: string) {
    setBusy(true);
    setMessage(null);
    try {
      const res = await api.recordOutcome(token, next, text);
      setResult(next);
      if (next === 'rejected' && text) {
        setMessage(
          res.reclassified
            ? 'We have read the rejection and updated your case. Answer the new questions and redraft.'
            : 'We have recorded the rejection. Review your answers and redraft.',
        );
      } else if (next === 'reinstated') {
        setMessage('Good. Thank you for telling us; it makes the pre-check sharper for the next seller.');
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'That did not save. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={{ marginTop: space.xl }}>
      <Heading level={2}>What happened?</Heading>
      <View style={{ marginTop: space.md, gap: space.sm }}>
        <Button
          label="Reinstated"
          variant={result === 'reinstated' ? 'primary' : 'secondary'}
          onPress={() => record('reinstated')}
          disabled={busy}
        />
        <Button
          label="Rejected, paste the reply"
          variant={result === 'rejected' ? 'primary' : 'secondary'}
          onPress={() => setResult('rejected')}
          disabled={busy}
        />
        <Button
          label="No reply yet"
          variant={result === 'pending' ? 'primary' : 'secondary'}
          onPress={() => record('pending')}
          disabled={busy}
        />
      </View>

      {result === 'rejected' ? (
        <View style={{ marginTop: space.md }}>
          <Muted>
            We read it, work out what they are now asking for, update your questions and unlock a redraft.
            Included for 30 days.
          </Muted>
          <TextInput
            style={styles.field}
            multiline
            value={rejection}
            onChangeText={setRejection}
            placeholder="Paste the platform's reply"
            placeholderTextColor={colors.muted}
          />
          <View style={{ height: space.sm }} />
          <Button
            label={busy ? 'Reading the rejection...' : 'Read it and update my case'}
            onPress={() => record('rejected', rejection)}
            disabled={busy || rejection.trim().length < 20}
          />
        </View>
      ) : null}

      {message ? (
        <View style={{ marginTop: space.md }}>
          <Notice>{message}</Notice>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginTop: space.sm,
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.rule,
    borderRadius: radius.control,
    backgroundColor: colors.white,
    padding: space.md,
    color: colors.ink,
    fontSize: type.ui.fontSize,
    textAlignVertical: 'top',
  },
});
