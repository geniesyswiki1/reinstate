import { Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors, fonts, radius, space, type } from '@/lib/theme';

const serif = Platform.select(fonts.serif);

export function Heading({ children, level = 1 }: { children: React.ReactNode; level?: 1 | 2 }) {
  return (
    <Text style={[level === 1 ? type.display : type.h2, { fontFamily: serif, color: colors.ink }]}>
      {children}
    </Text>
  );
}

export function Body({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <Text style={[type.body, { fontFamily: serif, color: colors.ink }, style as never]}>{children}</Text>
  );
}

export function Muted({ children }: { children: React.ReactNode }) {
  return <Text style={[type.small, { color: colors.muted }]}>{children}</Text>;
}

export function Notice({ children }: { children: React.ReactNode }) {
  return <Text style={[type.ui, { color: colors.notice }]} accessibilityRole="alert">{children}</Text>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}) {
  const primary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        primary ? styles.primary : styles.secondary,
        disabled && styles.disabled,
        pressed && { opacity: 0.85 },
      ]}
    >
      <Text style={[type.ui, { color: primary ? colors.sheet : colors.ink }]}>{label}</Text>
    </Pressable>
  );
}

export function Rule() {
  return <View style={{ height: 1, backgroundColor: colors.rule, marginVertical: space.lg }} />;
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.control,
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  primary: { backgroundColor: colors.reinstated },
  secondary: { backgroundColor: 'transparent', borderColor: colors.rule },
  disabled: { backgroundColor: colors.muted },
});
