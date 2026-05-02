import AsyncStorage from '@react-native-async-storage/async-storage';
import { TIPS } from './tips';
import { Platform } from 'react-native';

const TIPS_KEY = 'askfuji_tips';

export function getDailyTip(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return TIPS[dayOfYear % TIPS.length];
}

export async function requestPermissionsAndSchedule() {
  // Notifications require a development build — not supported in Expo Go on SDK 53+
  if (__DEV__) return;

  try {
    const Notifications = await import('expo-notifications');

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;

    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'AskFuji Tip',
        body: getDailyTip(),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 8,
        minute: 0,
      },
    });
  } catch (e) {
    // Notifications not available in this environment
  }
}

export async function saveTipToHistory(tip: string) {
  const raw = await AsyncStorage.getItem(TIPS_KEY);
  const existing = raw ? JSON.parse(raw) : [];
  const newTip = {
    id: Date.now().toString(),
    text: tip,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };
  const updated = [newTip, ...existing].slice(0, 90);
  await AsyncStorage.setItem(TIPS_KEY, JSON.stringify(updated));
}
