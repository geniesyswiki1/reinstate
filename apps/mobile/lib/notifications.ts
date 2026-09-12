import * as Notifications from 'expo-notifications';

/**
 * Two notification types, both opted into at the moment they are relevant, never
 * with an upfront prompt (section 12.2).
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function ensurePermission(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return true;
  if (!existing.canAskAgain) return false;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

/** Asked for only when a draft is actually running, because drafting takes a minute. */
export async function registerForDraftNotifications(): Promise<boolean> {
  return ensurePermission();
}

export async function notifyDraftReady(blockingCount: number): Promise<void> {
  const permitted = await Notifications.getPermissionsAsync();
  if (!permitted.granted) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Your draft is ready',
      body:
        blockingCount === 0
          ? 'The pre-check found nothing blocking. It is ready to submit.'
          : `The pre-check found ${blockingCount} ${blockingCount === 1 ? 'thing' : 'things'} that would get this rejected.`,
    },
    trigger: null,
  });
}

/** A 3-day reminder when the case has no outcome recorded (section 12.2). */
export async function scheduleOutcomeReminder(): Promise<void> {
  const permitted = await Notifications.getPermissionsAsync();
  if (!permitted.granted) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Any reply yet?',
      body: 'Tell us what the platform said. A rejection unlocks a redraft, included for 30 days.',
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 3 * 24 * 60 * 60, repeats: false },
  });
}
