import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors, fonts } from '@/lib/theme';
import { Platform } from 'react-native';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.sheet },
          headerTintColor: colors.ink,
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: Platform.select(fonts.serif), fontWeight: '600' },
          contentStyle: { backgroundColor: colors.sheet },
        }}
      >
        <Stack.Screen name="index" options={{ title: '' }} />
        <Stack.Screen name="cases" options={{ title: 'Your cases' }} />
        <Stack.Screen name="case/[token]/intake" options={{ title: 'Your answers' }} />
        <Stack.Screen name="case/[token]/evidence" options={{ title: 'Your evidence' }} />
        <Stack.Screen name="case/[token]/draft" options={{ title: 'Your appeal' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
