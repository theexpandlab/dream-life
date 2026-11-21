import { StyleSheet, Text } from 'react-native';
import { colors, fonts, space } from '@/theme/tokens';
import { Card } from './Card';
import { Eyebrow } from './Eyebrow';

type Props = { label: string; value: string; note?: string; noteTone?: 'good' | 'bad' };

/** Stat tile: eyebrow label, big serif number, optional change note. */
export function Tile({ label, value, note, noteTone }: Props) {
  return (
    <Card style={styles.tile}>
      <Eyebrow>{label}</Eyebrow>
      <Text style={styles.value}>{value}</Text>
      {note ? (
        <Text style={[styles.note, noteTone && { color: colors[noteTone] }]}>{note}</Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, minWidth: 150, gap: space.xs },
  value: { fontFamily: fonts.serif, fontSize: 44, lineHeight: 48, color: colors.ink },
  note: { fontFamily: fonts.sans, fontSize: 13, color: colors.ink },
});
