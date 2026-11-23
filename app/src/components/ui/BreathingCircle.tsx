import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

import { useReducedMotion } from '@/lib/useReducedMotion';
import { colors } from '@/theme/tokens';

/** In for 4, out for 4. Holds still when reduced motion is on. */
export function BreathingCircle({ size = 140 }: { size?: number }) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      scale.setValue(1);
      return;
    }
    const ease = Easing.inOut(Easing.sin);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.15, duration: 4000, easing: ease, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.8, duration: 4000, easing: ease, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduced, scale]);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[styles.circle, { width: size, height: size, borderRadius: size / 2, transform: [{ scale }] }]}
    />
  );
}

const styles = StyleSheet.create({
  circle: { backgroundColor: colors.lime, borderWidth: 1, borderColor: colors.ink, alignSelf: 'center' },
});
