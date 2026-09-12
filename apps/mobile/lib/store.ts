import * as SecureStore from 'expo-secure-store';

/**
 * The case token is the only credential the app holds. It goes in the keychain,
 * never in plain storage, because anyone with it can open the case.
 */
const CASES_KEY = 'reinstate.cases.v1';

export interface StoredCase {
  token: string;
  caseTypeId: string | null;
  platform: string | null;
  createdAt: string;
}

export async function listCases(): Promise<StoredCase[]> {
  try {
    const raw = await SecureStore.getItemAsync(CASES_KEY);
    return raw ? (JSON.parse(raw) as StoredCase[]) : [];
  } catch {
    return [];
  }
}

export async function addCase(record: StoredCase): Promise<void> {
  const cases = await listCases();
  if (cases.some((c) => c.token === record.token)) return;
  await SecureStore.setItemAsync(CASES_KEY, JSON.stringify([record, ...cases]));
}

export async function removeCase(token: string): Promise<void> {
  const cases = await listCases();
  await SecureStore.setItemAsync(CASES_KEY, JSON.stringify(cases.filter((c) => c.token !== token)));
}
