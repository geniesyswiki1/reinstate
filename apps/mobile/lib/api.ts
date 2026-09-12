import Constants from 'expo-constants';
import { ReinstateApi } from '@reinstate/shared';

/**
 * EXPO_PUBLIC_API_BASE_URL is set per EAS build profile (eas.json), so a preview
 * build talks to the test deploy and a production build talks to production.
 */
const baseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ??
  'https://reinstate-test.netlify.app';

export const api = new ReinstateApi({ baseUrl });
export const API_BASE_URL = baseUrl;
