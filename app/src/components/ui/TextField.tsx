import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, fonts, space } from '@/theme/tokens';

type Props = TextInputProps & { label: string; password?: boolean };

/** Labelled input. `password` adds a Show / Hide toggle. */
export function TextField({ label, password, style, ...rest }: Props) {
  const [hidden, setHidden] = useState(true);
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <TextInput
          placeholderTextColor="#8a8a80"
          secureTextEntry={password && hidden}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel={label}
          style={[styles.input, style]}
          {...rest}
        />
        {password ? (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            style={styles.toggle}
          >
            <Text style={styles.toggleTxt}>{hidden ? 'Show' : 'Hide'}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xs },
  label: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: colors.ink },
  row: { flexDirection: 'row', alignItems: 'stretch', borderWidth: 1, borderColor: colors.ink, backgroundColor: colors.paper },
  input: { flex: 1, minHeight: 52, paddingHorizontal: space.md, fontFamily: fonts.sans, fontSize: 17, color: colors.ink },
  toggle: { justifyContent: 'center', paddingHorizontal: space.md, borderLeftWidth: 1, borderLeftColor: colors.ink },
  toggleTxt: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.ink },
});
