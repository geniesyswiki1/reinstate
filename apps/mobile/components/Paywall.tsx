import { useState } from 'react';
import { Linking, View } from 'react-native';
import type { Tier } from '@reinstate/shared';
import { buy, restore } from '@/lib/purchases';
import { Button, Muted, Notice } from '@/components/ui';
import { space } from '@/lib/theme';

/**
 * Screen 2, section 12.5. A case is a digital good consumed in the app, so it is
 * an in-app purchase. No web checkout is offered here (section 12.4).
 */
export default function Paywall({
  tier,
  price,
  classificationId,
  onPurchased,
}: {
  tier: Tier;
  price: string;
  classificationId: string | null;
  onPurchased: (caseToken: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function purchase() {
    setBusy(true);
    setError(null);
    try {
      await buy(tier);
      // The RevenueCat webhook creates the case and emails the link. The app picks
      // the case up from that email, or from Restore purchases on the case list.
      setError(
        'Payment received. Your case link is on its way to the email on your App Store account. Open it from there, or use Restore purchases.',
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'The purchase did not complete.';
      if (!/cancel/i.test(message)) setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={{ marginTop: space.lg, gap: space.sm }}>
      <Button label={busy ? 'Opening...' : `Build my appeal, ${price}`} onPress={purchase} disabled={busy} />
      <Muted>
        One payment. Includes the intake, reading your documents, the draft, the pre-check, and unlimited
        redrafts and rejection handling for 30 days.
      </Muted>
      <Button label="Restore purchases" variant="secondary" onPress={() => restore()} />
      <Button
        label="Terms and privacy"
        variant="secondary"
        onPress={() => Linking.openURL('https://reinstate.app/terms')}
      />
      {classificationId ? null : (
        <Muted>Classify your notice first so we know which case this is.</Muted>
      )}
      {error ? <Notice>{error}</Notice> : null}
    </View>
  );
}
