import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabButton } from '@/components/TabBar';
import { colors, space } from '@/theme/tokens';

/**
 * Five tabs. Sections from the prototype are grouped inside them:
 * Home (Overview, Goals), Today (Daily), Reflect (Weekly, Monthly),
 * Wins (Win board, Highlights, The dump), Dream (Dream you).
 */
const TABS = [
  { name: 'home', href: '/home', label: 'Home' },
  { name: 'today', href: '/today', label: 'Today' },
  { name: 'reflect', href: '/reflect', label: 'Reflect' },
  { name: 'wins', href: '/wins', label: 'Wins' },
  { name: 'dream', href: '/dream', label: 'Dream ✦' },
] as const;

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs style={styles.root}>
      <TabSlot style={styles.slot} />
      <TabList style={[styles.bar, { paddingBottom: Math.max(insets.bottom, space.sm) }]}>
        {TABS.map((t) => (
          <TabTrigger key={t.name} name={t.name} href={t.href} asChild>
            <TabButton label={t.label} />
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  slot: { flex: 1, minHeight: 0 },
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.cream,
    borderTopWidth: 1,
    borderTopColor: colors.ink,
    paddingTop: space.xs,
    paddingHorizontal: space.xs,
  },
});
