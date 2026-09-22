import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { FinanceGlyph } from '@/components/finance/FinanceGlyph';
import { AppText } from '@/components/ui/AppText';
import type { FinanceNeed, FinanceNode, FinanceProgress } from '@/data/finance';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { tapLight } from '@/lib/haptics';
import { space } from '@/theme';

const NODE = 56;

type Props = {
  progress: FinanceProgress;
  peek?: FinanceNode;
  onPeek: (circleId: string) => void;
  onPressNeed: (need: FinanceNeed) => void;
};

export function FinanceProgressBar({ progress, peek, onPeek, onPressNeed }: Props) {
  const { colors } = useResolvedTheme();
  const scroller = useRef<ScrollView>(null);
  const node = peek ?? progress.nodes.find((item) => item.status === 'next');
  const nextIndex = Math.max(
    0,
    progress.nodes.findIndex((item) => item.circle.id === (node?.circle.id ?? progress.next?.id)),
  );
  const unmet = node?.status === 'done' ? [] : (node?.needs.filter((need) => !need.met) ?? []);
  const kicker = !node
    ? 'Compound'
    : node.status === 'done'
      ? `Reached ${node.circle.name}`
      : node.status === 'ahead'
        ? `Ahead ${node.circle.name} · ${node.circle.gate}`
        : progress.current
          ? `${progress.current.name} · next ${node.circle.name} ${node.circle.gate}`
          : `Next ${node.circle.name} · ${node.circle.gate}`;

  useEffect(() => {
    const x = Math.max(0, (nextIndex - 1) * NODE);
    requestAnimationFrame(() => scroller.current?.scrollTo({ x, animated: false }));
  }, [nextIndex]);

  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <AppText variant="overline" tone="accent">
          Finance
        </AppText>
        <AppText variant="caption" tone="muted" numberOfLines={1} style={styles.kicker}>
          {kicker}
        </AppText>
      </View>
      <ScrollView
        ref={scroller}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {progress.nodes.map((item, index) => {
          const selected = item.circle.id === node?.circle.id;
          const border = selected
            ? colors.accent
            : item.status === 'done'
              ? colors.accentSoft
              : colors.line;
          const fill = item.status === 'done' ? colors.well : colors.surface;
          const glyph = item.status === 'ahead' && !selected ? colors.muted : colors.accent;
          return (
            <View key={item.circle.id} style={styles.node}>
              {index > 0 ? (
                <View
                  style={[
                    styles.bridge,
                    { backgroundColor: progress.nodes[index - 1].status === 'done' ? colors.accentSoft : colors.line },
                  ]}
                />
              ) : null}
              <Pressable
                onPress={() => {
                  tapLight();
                  onPeek(item.circle.id);
                }}
                accessibilityRole="button"
                accessibilityLabel={`${item.circle.name} ${item.circle.gate}`}
                style={styles.hit}>
                <View
                  style={[
                    styles.ring,
                    {
                      borderColor: border,
                      backgroundColor: fill,
                      borderStyle: item.status === 'done' ? 'solid' : 'dashed',
                    },
                  ]}>
                  <FinanceGlyph kind={item.circle.glyph} size={16} color={glyph} />
                </View>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
      {unmet.length > 0 ? (
        <View style={styles.needs}>
          {unmet.map((need) => (
            <Pressable
              key={`${need.orbit}-${need.catalogId}-${need.label}`}
              onPress={() => {
                tapLight();
                onPressNeed(need);
              }}
              accessibilityRole="button"
              accessibilityLabel={need.label}
              style={[styles.chip, { borderColor: colors.line, backgroundColor: colors.surface }]}>
              <Ionicons name="ellipse-outline" size={12} color={colors.muted} />
              <AppText variant="caption" numberOfLines={1}>
                {need.label}
              </AppText>
            </Pressable>
          ))}
        </View>
      ) : node?.status === 'done' || !node ? (
        <AppText variant="caption" tone="muted">
          {node?.circle.blurb ?? 'Top circle. Keep the numbers where they are.'}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: space.sm,
    paddingHorizontal: space.lg,
    paddingBottom: space.sm,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: space.md,
  },
  kicker: {
    flex: 1,
    textAlign: 'right',
  },
  row: {
    alignItems: 'center',
    paddingVertical: 2,
  },
  node: {
    width: NODE,
    alignItems: 'center',
  },
  hit: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bridge: {
    position: 'absolute',
    left: -8,
    top: 15,
    width: 16,
    height: 2,
    borderRadius: 1,
  },
  needs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    minHeight: 28,
    maxWidth: '100%',
  },
});
