import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/** Light tap feedback. No-op on web. */
export function tick() {
  if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
}

/** Celebration feedback for finishing something. No-op on web. */
export function celebrate() {
  if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
