import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/theme/tokens';

const MESSAGE = 'SHOWING UP FOR YOUR LIFE IS FUN :)  ✦  ';
const REPEAT = 6;

/** The signature lime scrolling banner. Holds still when reduced motion is on. */
export function Ticker() {
  const x = useRef(new Animated.Value(0)).current;
  const [segment, setSegment] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (reduceMotion || segment === 0) {
      x.setValue(0);
      return;
    }
    // Scroll exactly one copy of the message, then loop seamlessly.
    const anim = Animated.loop(
      Animated.timing(x, {
        toValue: -segment,
        duration: segment * 25,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    anim.start();
    return () => anim.stop();
  }, [reduceMotion, segment, x]);

  return (
    <View style={styles.band} accessible accessibilityLabel="Showing up for your life is fun">
      <Animated.View style={[styles.track, { transform: [{ translateX: x }] }]}>
        {Array.from({ length: REPEAT }, (_, i) => (
          <Text
            key={i}
            style={styles.text}
            onLayout={i === 0 ? (e) => setSegment(e.nativeEvent.layout.width) : undefined}
          >
            {MESSAGE}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    backgroundColor: colors.lime,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.ink,
    overflow: 'hidden',
    paddingVertical: 10,
  },
  track: { flexDirection: 'row', width: 10000 },
  text: { fontFamily: fonts.mono, fontSize: 13, letterSpacing: 1.5, color: colors.ink },
});
