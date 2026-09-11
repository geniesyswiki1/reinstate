import { useCallback, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { getCaseType, type ExtractedFact } from '@reinstate/shared';
import { api } from '@/lib/api';
import { Body, Button, Heading, Muted, Notice, Rule } from '@/components/ui';
import { colors, space } from '@/lib/theme';

interface Uploaded {
  id: string;
  filename: string;
  fact: ExtractedFact | null;
  confirmed: boolean;
}

/** Screen 4, section 12.5. The checklist from classification, then capture and confirm. */
export default function Evidence() {
  const { token, caseType: caseTypeId } = useLocalSearchParams<{ token: string; caseType?: string }>();
  const router = useRouter();
  const caseType = getCaseType(caseTypeId ?? null);

  const [files, setFiles] = useState<Uploaded[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (uri: string, name: string, mimeType: string) => {
      setBusy(true);
      setError(null);
      try {
        const form = new FormData();
        // React Native's FormData takes this shape for a file on disk.
        form.append('file', { uri, name, type: mimeType } as unknown as Blob);

        const res = await api.uploadEvidence(token, form);
        const row: Uploaded = { id: res.evidence.id, filename: res.evidence.filename, fact: null, confirmed: false };
        setFiles((prev) => [...prev, row]);

        const extracted = await api.extract(token, row.id);
        setFiles((prev) => prev.map((f) => (f.id === row.id ? { ...f, fact: extracted.fact } : f)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'The upload failed. Try again.');
      } finally {
        setBusy(false);
      }
    },
    [token],
  );

  const scan = useCallback(async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setError('Reinstate needs the camera to photograph your documents. Enable it in Settings.');
      return;
    }
    const shot = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (shot.canceled || !shot.assets[0]) return;
    const asset = shot.assets[0];
    await upload(asset.uri, asset.fileName ?? `page-${Date.now()}.jpg`, asset.mimeType ?? 'image/jpeg');
  }, [upload]);

  const pickPhoto = useCallback(async () => {
    const shot = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
    if (shot.canceled || !shot.assets[0]) return;
    const asset = shot.assets[0];
    await upload(asset.uri, asset.fileName ?? `photo-${Date.now()}.jpg`, asset.mimeType ?? 'image/jpeg');
  }, [upload]);

  const pickFile = useCallback(async () => {
    const picked = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/*'] });
    if (picked.canceled || !picked.assets[0]) return;
    const asset = picked.assets[0];
    await upload(asset.uri, asset.name, asset.mimeType ?? 'application/pdf');
  }, [upload]);

  async function confirm(id: string, confirmed: boolean) {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, confirmed } : f)));
    try {
      await api.confirmEvidence(token, id, confirmed);
    } catch {
      setError('That did not save. Try again.');
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Heading level={2}>Your evidence</Heading>
      <View style={{ height: space.sm }} />
      <Muted>We read each file and cite only what you confirm.</Muted>

      {caseType ? (
        <View style={{ marginTop: space.md, gap: space.sm }}>
          {caseType.evidence.map((item) => (
            <View key={item.id}>
              <Body>
                {item.required ? '+ ' : '- '}
                {item.label}
                {item.required ? '' : ' (optional)'}
              </Body>
              <Muted>{item.why}</Muted>
            </View>
          ))}
        </View>
      ) : null}

      <View style={{ marginTop: space.lg, gap: space.sm }}>
        <Button label={busy ? 'Reading the document...' : 'Scan a document'} onPress={scan} disabled={busy} />
        <Button label="Choose a photo" variant="secondary" onPress={pickPhoto} disabled={busy} />
        <Button label="Choose a file" variant="secondary" onPress={pickFile} disabled={busy} />
      </View>

      {error ? (
        <View style={{ marginTop: space.md }}>
          <Notice>{error}</Notice>
        </View>
      ) : null}

      {files.map((f) => (
        <View key={f.id} style={{ marginTop: space.lg }}>
          <Rule />
          <Body>{f.filename}</Body>
          {f.fact ? (
            <>
              <View style={{ height: space.sm }} />
              <Body>We found: {f.fact.summary} Is this right?</Body>
              {f.fact.flags.length > 0 ? (
                <View style={{ marginTop: space.xs }}>
                  <Notice>Watch out: {f.fact.flags.join(', ')}.</Notice>
                </View>
              ) : null}
              <View style={{ marginTop: space.sm, gap: space.sm }}>
                <Button
                  label={f.confirmed ? 'Using this' : 'Yes, use it'}
                  variant={f.confirmed ? 'primary' : 'secondary'}
                  onPress={() => confirm(f.id, true)}
                />
                <Button label="No, skip this" variant="secondary" onPress={() => confirm(f.id, false)} />
              </View>
            </>
          ) : (
            <Muted>Reading this document...</Muted>
          )}
        </View>
      ))}

      <View style={{ marginTop: space.xl }}>
        <Button
          label="Write my appeal"
          onPress={() => router.push(`/case/${token}/draft?caseType=${caseType?.id ?? ''}`)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.sheet },
  content: { padding: space.lg, paddingBottom: space.xl * 2 },
});
