import { useEffect, useState } from 'react';
import { ScrollView, TextInput, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getCaseType } from '@reinstate/shared';
import { api } from '@/lib/api';
import { listCases, addCase, type StoredCase } from '@/lib/store';
import { restore } from '@/lib/purchases';
import { Body, Button, Heading, Muted, Notice, Rule } from '@/components/ui';
import { colors, radius, space, type } from '@/lib/theme';

/** Screen 6, section 12.5. The user's cases, plus the redemption path. */
export default function Cases() {
  const router = useRouter();
  const [cases, setCases] = useState<StoredCase[]>([]);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void listCases().then(setCases);
  }, []);

  async function sendLink() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await api.requestMagicLink(email);
      setMessage(res.message);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'That did not send. Try again.');
    } finally {
      setBusy(false);
    }
  }

  async function openToken() {
    const clean = token.trim();
    if (clean.length < 16) {
      setMessage('That does not look like a case link. Paste the whole link from your email.');
      return;
    }
    const parsed = clean.split('/').pop() ?? clean;
    await addCase({ token: parsed, caseTypeId: null, platform: null, createdAt: new Date().toISOString() });
    router.push(`/case/${parsed}/intake`);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Heading level={2}>Your cases</Heading>

      {cases.length === 0 ? (
        <View style={{ marginTop: space.md }}>
          <Muted>No cases on this device yet.</Muted>
        </View>
      ) : (
        <View style={{ marginTop: space.md, gap: space.sm }}>
          {cases.map((c) => {
            const ct = getCaseType(c.caseTypeId);
            return (
              <Button
                key={c.token}
                variant="secondary"
                label={ct ? ct.name : 'Case'}
                onPress={() => router.push(`/case/${c.token}/draft`)}
              />
            );
          })}
        </View>
      )}

      <Rule />
      <Body>Opening a case you bought already</Body>
      <View style={{ height: space.sm }} />
      <Muted>Your case link is in the email we sent when you paid. Paste it here, or ask for it again.</Muted>

      <TextInput
        style={styles.field}
        value={token}
        onChangeText={setToken}
        autoCapitalize="none"
        placeholder="https://reinstate.app/case/..."
        placeholderTextColor={colors.muted}
      />
      <View style={{ height: space.sm }} />
      <Button label="Open this case" onPress={openToken} />

      <View style={{ height: space.lg }} />
      <TextInput
        style={styles.field}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="you@yourbusiness.com"
        placeholderTextColor={colors.muted}
      />
      <View style={{ height: space.sm }} />
      <Button label={busy ? 'Sending...' : 'Send my case link'} variant="secondary" onPress={sendLink} disabled={busy} />

      <View style={{ height: space.lg }} />
      <Button label="Restore purchases" variant="secondary" onPress={() => restore()} />

      {message ? (
        <View style={{ marginTop: space.md }}>
          <Notice>{message}</Notice>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.sheet },
  content: { padding: space.lg, paddingBottom: space.xl * 2 },
  field: {
    marginTop: space.sm,
    borderWidth: 1,
    borderColor: colors.rule,
    borderRadius: radius.control,
    backgroundColor: colors.white,
    padding: space.md,
    color: colors.ink,
    fontSize: type.ui.fontSize,
  },
});
