'use client';

import { useMemo, useState } from 'react';
import type { CaseType, IntakeQuestion } from '@reinstate/shared';

interface Props {
  token: string;
  caseType: CaseType;
  initial: Record<string, string>;
  onChange?: (answers: Record<string, string>) => void;
}

function visible(questions: IntakeQuestion[], answers: Record<string, string>): IntakeQuestion[] {
  return questions.filter((q) => {
    if (!q.showIf) return true;
    const value = answers[q.showIf.question_id];
    return String(value ?? '') === String(q.showIf.equals);
  });
}

/** Rendered from the case type schema, autosaved per answer. */
export default function Intake({ token, caseType, initial, onChange }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>(initial);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const shown = useMemo(() => visible(caseType.intake, answers), [caseType.intake, answers]);
  const answered = shown.filter((q) => (answers[q.id] ?? '').trim()).length;

  async function save(id: string, value: string) {
    setSaving(id);
    setError(null);
    try {
      const res = await fetch(`/api/case/${token}/answer`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question_id: id, value }),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? 'That answer did not save. Try again.');
      }
    } catch {
      setError('That answer did not save. Check your connection and try again.');
    } finally {
      setSaving(null);
    }
  }

  function update(id: string, value: string) {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    onChange?.(next);
  }

  return (
    <section aria-label="Intake">
      <div className="flex items-baseline justify-between">
        <h2>The questions that matter</h2>
        <p className="m-0 text-small text-muted">
          Question {Math.min(answered + 1, shown.length)} of {shown.length}
        </p>
      </div>

      {error ? (
        <p className="mt-3 text-ui text-notice" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-6">
        {shown.map((q) => (
          <div key={q.id} className="mb-7 border-b border-rule pb-6">
            <label htmlFor={q.id} className="block text-ui font-medium">
              {q.label}
              {q.required ? '' : ' (optional)'}
            </label>
            <p className="mb-2 mt-1 text-small text-muted">{q.why}</p>

            {q.type === 'longtext' ? (
              <textarea
                id={q.id}
                className="field min-h-[100px]"
                value={answers[q.id] ?? ''}
                placeholder={q.placeholder}
                onChange={(e) => update(q.id, e.target.value)}
                onBlur={(e) => save(q.id, e.target.value)}
              />
            ) : q.type === 'choice' ? (
              <select
                id={q.id}
                className="field"
                value={answers[q.id] ?? ''}
                onChange={(e) => {
                  update(q.id, e.target.value);
                  void save(q.id, e.target.value);
                }}
              >
                <option value="">Choose one</option>
                {(q.options ?? []).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : q.type === 'boolean' ? (
              <div className="flex gap-2">
                {['Yes', 'No'].map((o) => (
                  <button
                    key={o}
                    type="button"
                    className={`btn ${answers[q.id] === o ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => {
                      update(q.id, o);
                      void save(q.id, o);
                    }}
                  >
                    {o}
                  </button>
                ))}
              </div>
            ) : (
              <input
                id={q.id}
                className="field"
                type={q.type === 'date' ? 'date' : q.type === 'number' ? 'number' : 'text'}
                value={answers[q.id] ?? ''}
                placeholder={q.placeholder}
                onChange={(e) => update(q.id, e.target.value)}
                onBlur={(e) => save(q.id, e.target.value)}
              />
            )}

            {saving === q.id ? <p className="mt-1 text-small text-muted">Saving...</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
