import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { AppText } from '@/components/ui/AppText';
import type { MomentumTrack } from '@/data/finance';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { tapLight } from '@/lib/haptics';
import { fonts, space } from '@/theme';

const CELLS = 12;

type Props = {
  tracks: MomentumTrack[];
  onPressTrack: (track: MomentumTrack) => void;
};

export function FinanceMomentum({ tracks, onPressTrack }: Props) {
  return (
    <Card style={styles.card}>
      <AppText variant="overline" tone="accent">
        Momentum
      </AppText>
      <View style={styles.tracks}>
        {tracks.map((track) => (
          <TrackRow key={track.id} track={track} onPress={() => onPressTrack(track)} />
        ))}
      </View>
    </Card>
  );
}

function TrackRow({ track, onPress }: { track: MomentumTrack; onPress: () => void }) {
  const { colors } = useResolvedTheme();
  const fill =
    track.current === undefined ? 0 : Math.min(CELLS, Math.round((track.current / track.max) * CELLS));
  const linePct = Math.min(92, Math.max(8, (track.line / track.max) * 100));

  return (
    <Pressable
      onPress={() => {
        tapLight();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={`${track.label} ${track.mark}`}
      style={styles.row}>
      <AppText variant="overline" style={styles.label}>
        {track.label}
      </AppText>
      <View style={styles.bar}>
        <View style={styles.cells}>
          {Array.from({ length: CELLS }, (_, index) => {
            const on = index < fill;
            const past = (index + 0.5) / CELLS > track.line / track.max;
            let backgroundColor = colors.well;
            if (on && track.invert && past) backgroundColor = colors.action;
            else if (on) backgroundColor = colors.accent;
            return <View key={index} style={[styles.cell, { backgroundColor }]} />;
          })}
        </View>
        <View pointerEvents="none" style={[styles.gate, { left: `${linePct}%`, backgroundColor: colors.text }]} />
      </View>
      <AppText variant="caption" numberOfLines={1} style={[styles.mark, { color: colors.muted }]}>
        {track.mark}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    gap: space.sm,
  },
  tracks: {
    gap: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 20,
  },
  label: {
    width: 52,
  },
  bar: {
    flex: 1,
    height: 12,
    justifyContent: 'center',
  },
  cells: {
    flexDirection: 'row',
    gap: 2,
    height: 8,
  },
  cell: {
    flex: 1,
    height: 8,
    borderRadius: 2,
  },
  gate: {
    position: 'absolute',
    top: -2,
    width: 2,
    height: 16,
    borderRadius: 1,
    marginLeft: -1,
  },
  mark: {
    width: 82,
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0,
    textAlign: 'right',
  },
});
