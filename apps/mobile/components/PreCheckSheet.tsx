import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { PreCheckReport } from '@reinstate/shared';
import { colors, space, type } from '@/lib/theme';
import { Muted } from '@/components/ui';

/** The pre-check as a bottom sheet, with the blocking count as a pill (section 12.5). */
export default function PreCheckSheet({
  report,
  open,
  onToggle,
}: {
  report: PreCheckReport;
  open: boolean;
  onToggle: () => void;
}) {
  const failed = report.items.filter((i) => !i.passed);
  const blocking = failed.filter((i) => i.severity === 'blocking');
  const advisory = failed.filter((i) => i.severity === 'advisory');

  return (
    <View style={[styles.sheet, open && styles.sheetOpen]}>
      <Pressable onPress={onToggle} accessibilityRole="button" style={styles.handle}>
        <Text style={[type.ui, { color: report.ready ? colors.reinstated : colors.notice }]}>
          {report.ready ? 'Ready to submit' : `${blocking.length} will get this rejected`}
        </Text>
        <View style={[styles.pill, { backgroundColor: report.ready ? colors.reinstated : colors.notice }]}>
          <Text style={[type.small, { color: colors.sheet }]}>{blocking.length}</Text>
        </View>
      </Pressable>

      {open ? (
        <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: space.lg }}>
          {blocking.map((item) => (
            <View key={item.id} style={{ marginBottom: space.md }}>
              <Text style={[type.ui, { color: colors.ink }]}>x {item.reason}</Text>
              {item.at_fault ? (
                <Text style={[type.small, styles.atFault]}>{item.at_fault}</Text>
              ) : null}
            </View>
          ))}

          {advisory.length > 0 ? (
            <>
              <Text style={[type.ui, { color: colors.ink, marginBottom: space.sm }]}>Worth fixing</Text>
              {advisory.map((item) => (
                <Text key={item.id} style={[type.small, { color: colors.muted, marginBottom: space.sm }]}>
                  - {item.reason}
                </Text>
              ))}
            </>
          ) : null}

          <Muted>
            {report.items.length - failed.length} of {report.items.length} checks passed. Worst paragraph scores{' '}
            {report.generic_max.toFixed(2)} for genericity.
          </Muted>
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.rule,
    maxHeight: 80,
  },
  sheetOpen: { maxHeight: '60%' },
  handle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  pill: { minWidth: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  body: { paddingHorizontal: space.lg },
  atFault: {
    color: colors.muted,
    borderLeftWidth: 2,
    borderLeftColor: colors.rule,
    paddingLeft: space.sm,
    marginTop: space.xs,
  },
});
