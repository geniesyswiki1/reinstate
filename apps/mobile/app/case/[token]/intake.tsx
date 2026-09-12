import { useMemo, useState } from 'react';
import { ScrollView, TextInput, View, StyleSheet, Pressable, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getCaseType, type IntakeQuestion } from '@reinstate/shared';
import { api } from '@/lib/api';
import { Body, Button, Heading, Muted, Notice } from '@/components/ui';
import { colors, radius, space, type } from '@/lib/theme';

/** Screen 3, section 12.5. One question per screen, with the reason under it. */
export default function Intake() {
  const { token, caseType: caseTypeId } = useLocalSearchParams<{ token: string; caseType?: string }>();
  const router = useRouter();
  const caseType = getCaseType(caseTypeId ?? null);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questions = useMemo<IntakeQuestion[]>(() => {
    if (!caseType) return [];
    return caseType.intake.filter((q) => {
      if (!q.showIf) return true;
      return String(answers[q.showIf.question_id] ?? '') === String(q.showIf.equals);
    });
  }, [caseType, answers]);

  if (!caseType) {
    return (
      <View style={styles.content}>
        <Body>
          We do not know which case type this is yet. Open the case link from your email, which carries it.
        </Body>
      </View>
    );
  }

  const resolved = caseType;
  const question = questions[index];
  const value = answers[question?.id ?? ''] ?? '';

  async function saveAndAdvance(direction: 1 | -1) {
    if (!question) return;
    if (direction === 1) {
      setBusy(true);
      setError(null);
      try {
        await api.saveAnswer(token, question.id, value);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'That answer did not save. Try again.');
        setBusy(false);
        return;
      }
      setBusy(false);
    }

    const next = index + direction;
    if (next < 0) return;
    if (next >= questions.length) {
      router.push(`/case/${token}/evidence?caseType=${resolved.id}`);
      return;
    }
    setIndex(next);
  }

  function update(next: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: next }));
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Muted>
        Question {index + 1} of {questions.length}
      </Muted>

      <View style={{ height: space.md }} />
      <Heading level={2}>{question.label}</Heading>
      <View style={{ height: space.sm }} />
      <Muted>{question.why}</Muted>

      {question.type === 'choice' ? (
        <View style={{ marginTop: space.md, gap: space.sm }}>
          {(question.options ?? []).map((option) => (
            <Pressable
              key={option}
              accessibilityRole="radio"
              accessibilityState={{ selected: value === option }}
              onPress={() => update(option)}
              style={[styles.option, value === option && styles.optionSelected]}
            >
              <Text style={[type.ui, { color: value === option ? colors.sheet : colors.ink }]}>{option}</Text>
            </Pressable>
          ))}
        </View>
      ) : question.type === 'boolean' ? (
        <View style={{ marginTop: space.md, gap: space.sm }}>
          {['Yes', 'No'].map((option) => (
            <Pressable
              key={option}
              accessibilityRole="radio"
              accessibilityState={{ selected: value === option }}
              onPress={() => update(option)}
              style={[styles.option, value === option && styles.optionSelected]}
            >
              <Text style={[type.ui, { color: value === option ? colors.sheet : colors.ink }]}>{option}</Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <TextInput
          style={[styles.field, question.type === 'longtext' && { minHeight: 140 }]}
          multiline={question.type === 'longtext'}
          value={value}
          onChangeText={update}
          keyboardType={question.type === 'number' ? 'number-pad' : 'default'}
          placeholder={question.placeholder}
          placeholderTextColor={colors.muted}
        />
      )}

      {error ? (
        <View style={{ marginTop: space.md }}>
          <Notice>{error}</Notice>
        </View>
      ) : null}

      <View style={{ marginTop: space.lg, gap: space.sm }}>
        <Button
          label={busy ? 'Saving...' : index + 1 >= questions.length ? 'On to the evidence' : 'Next'}
          onPress={() => saveAndAdvance(1)}
          disabled={busy || (question.required && !value.trim())}
        />
        {index > 0 ? <Button label="Back" variant="secondary" onPress={() => saveAndAdvance(-1)} /> : null}
        {!question.required ? (
          <Button label="Skip this one" variant="secondary" onPress={() => saveAndAdvance(1)} />
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.sheet },
  content: { padding: space.lg, paddingBottom: space.xl * 2 },
  field: {
    marginTop: space.md,
    borderWidth: 1,
    borderColor: colors.rule,
    borderRadius: radius.control,
    backgroundColor: colors.white,
    padding: space.md,
    color: colors.ink,
    fontSize: type.ui.fontSize,
    textAlignVertical: 'top',
  },
  option: {
    borderWidth: 1,
    borderColor: colors.rule,
    borderRadius: radius.control,
    padding: space.md,
    backgroundColor: colors.white,
  },
  optionSelected: { backgroundColor: colors.reinstated, borderColor: colors.reinstated },
});
