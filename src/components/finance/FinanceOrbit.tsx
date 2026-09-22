import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { FinanceGlyph } from '@/components/finance/FinanceGlyph';
import { AppText } from '@/components/ui/AppText';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { fonts, space } from '@/theme';
import type { FinanceGlyphId } from '@/types';

export type FinanceOrbitSlot = {
  id: string;
  label: string;
  mark: string;
  glyph: FinanceGlyphId;
  filled: boolean;
  tone?: 'open' | 'ok' | 'soon' | 'due';
};

type Props = {
  title: string;
  current: string;
  goal: string;
  done?: boolean;
  slots: FinanceOrbitSlot[];
  onPressSlot: (id: string) => void;
  onAdd?: () => void;
};

export function FinanceOrbit({ title, current, goal, done, slots, onPressSlot, onAdd }: Props) {
  const { colors } = useResolvedTheme();
  const [box, setBox] = useState(0);
  const cell = box || 220;
  const circle = Math.min(cell * 0.72, 200);
  const bubble = Math.min(40, circle * 0.22);
  const orbit = circle * 0.58;
  const plus = 24;
  const count = Math.max(slots.length, 1);
  const sweep = onAdd ? Math.PI * 1.7 : Math.PI * 2;
  const start = onAdd ? -Math.PI / 2 - sweep / 2 : -Math.PI / 2;
  const reach = Math.max(orbit + bubble / 2 - circle / 2, 0);
  const ringColor = done ? colors.accent : colors.line;

  return (
    <View
      style={styles.wrap}
      onLayout={(event) => {
        const next = event.nativeEvent.layout.width;
        if (next && Math.abs(next - box) > 1) setBox(next);
      }}>
      <AppText variant="overline" tone="accent">
        {title}
      </AppText>
      <AppText variant="caption" tone={done ? 'accent' : 'muted'}>
        {done ? `Goal ${goal}` : `Goal ${goal}`}
      </AppText>
      <View style={[styles.stage, { height: circle + reach * 2 }]}>
        <View
          style={[
            styles.ring,
            {
              width: circle,
              height: circle,
              borderRadius: circle / 2,
              borderColor: ringColor,
              backgroundColor: colors.surface,
              borderStyle: done ? 'solid' : 'dashed',
            },
          ]}>
          <AppText
            variant="title"
            numberOfLines={1}
            style={{ fontSize: Math.round(circle * 0.22), lineHeight: Math.round(circle * 0.26) }}>
            {current}
          </AppText>
          {slots.map((slot, index) => {
            const angle =
              !onAdd && count > 0
                ? start + ((Math.PI * 2) * index) / count
                : count === 1
                  ? -Math.PI / 2
                  : start + (sweep * index) / Math.max(count - 1, 1);
            const toneColor =
              slot.tone === 'due' ? colors.action : slot.tone === 'soon' ? colors.accentSoft : colors.accent;
            const border = slot.filled || slot.tone === 'due' || slot.tone === 'soon' ? toneColor : colors.line;
            const fill = slot.filled ? colors.well : colors.surface;
            const color = slot.filled || slot.tone === 'due' ? toneColor : colors.muted;
            return (
              <Pressable
                key={slot.id}
                onPress={() => onPressSlot(slot.id)}
                accessibilityRole="button"
                accessibilityLabel={`${slot.label} ${slot.mark}`}
                style={[
                  styles.bubble,
                  {
                    width: bubble,
                    height: bubble,
                    borderRadius: bubble / 2,
                    left: circle / 2 + Math.cos(angle) * orbit - bubble / 2,
                    top: circle / 2 + Math.sin(angle) * orbit - bubble / 2,
                    backgroundColor: fill,
                    borderColor: border,
                    borderStyle: slot.filled ? 'solid' : 'dashed',
                  },
                ]}>
                <FinanceGlyph kind={slot.glyph} size={bubble * 0.48} color={color} />
              </Pressable>
            );
          })}
          {onAdd ? (
            <Pressable
              onPress={onAdd}
              accessibilityRole="button"
              accessibilityLabel="Add"
              style={[
                styles.plus,
                {
                  width: plus,
                  height: plus,
                  borderRadius: plus / 2,
                  backgroundColor: colors.line,
                  left: (circle - plus) / 2,
                },
              ]}>
              <AppText style={[styles.plusMark, { color: colors.muted, fontSize: plus * 0.62 }]}>+</AppText>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignItems: 'center',
    gap: space.sm,
  },
  stage: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  ring: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  bubble: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 2,
  },
  plus: {
    position: 'absolute',
    bottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusMark: {
    fontFamily: fonts.display,
    marginTop: -2,
  },
});
