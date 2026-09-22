import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { HOME_INTERVALS, nextUpkeepAt, upkeepDueState } from '@/data/home';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { tapLight } from '@/lib/haptics';
import { formatRequestOn } from '@/lib/split';
import { radius, space } from '@/theme';
import type { HomeInterval } from '@/types';

type Props = {
  open: boolean;
  title: string;
  interval: HomeInterval;
  nextAt?: string;
  canRemove?: boolean;
  onClose: () => void;
  onSave: (next: { interval: HomeInterval; nextAt?: string }) => void;
  onRemove?: () => void;
};

export function HomeUpkeepSheet({
  open,
  title,
  interval,
  nextAt,
  canRemove,
  onClose,
  onSave,
  onRemove,
}: Props) {
  const { colors } = useResolvedTheme();
  const insets = useSafeAreaInsets();
  const [nextInterval, setNextInterval] = useState(interval);
  const [due, setDue] = useState(nextAt);
  const state = upkeepDueState(due);
  const dueLabel = formatRequestOn(due);

  useEffect(() => {
    if (!open) return;
    setNextInterval(interval);
    setDue(nextAt);
  }, [open, interval, nextAt]);

  const headline =
    state === 'open'
      ? 'No service date yet'
      : state === 'due'
        ? `Overdue${dueLabel ? ` · ${dueLabel}` : ''}`
        : `Next service ${dueLabel}`;

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          onPress={() => undefined}
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              borderColor: colors.line,
              paddingBottom: Math.max(insets.bottom, space.xl),
            },
          ]}>
          <View style={[styles.handle, { backgroundColor: colors.line }]} />
          <AppText variant="overline" tone="accent">
            Maintenance
          </AppText>
          <AppText variant="title">{title}</AppText>
          <AppText variant="body" tone={state === 'due' ? 'action' : 'muted'}>
            {headline}
          </AppText>
          <AppText variant="overline" tone="muted">
            Interval
          </AppText>
          <View style={styles.row}>
            {HOME_INTERVALS.map((item) => {
              const active = nextInterval === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    tapLight();
                    setNextInterval(item.id);
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  style={[
                    styles.chip,
                    {
                      borderColor: active ? colors.accent : colors.line,
                      backgroundColor: active ? colors.accent : colors.surface,
                    },
                  ]}>
                  <AppText variant="caption" style={{ color: active ? colors.background : colors.text }}>
                    {item.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
          <Button
            label="Mark done"
            onPress={() => {
              const next = nextUpkeepAt(new Date(), nextInterval).toISOString();
              setDue(next);
              onSave({ interval: nextInterval, nextAt: next });
              onClose();
            }}
          />
          <Button
            label="Due now"
            variant="ghost"
            onPress={() => {
              const next = new Date().toISOString();
              setDue(next);
              onSave({ interval: nextInterval, nextAt: next });
              onClose();
            }}
          />
          <Button
            label="Save interval"
            variant="ghost"
            onPress={() => {
              onSave({ interval: nextInterval, nextAt: due });
              onClose();
            }}
          />
          {canRemove && onRemove ? (
            <Button
              label="Remove"
              variant="danger"
              onPress={() => {
                onRemove();
                onClose();
              }}
            />
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(14, 28, 26, 0.46)',
  },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: space.xl,
    paddingTop: space.md,
    gap: space.md,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 2,
    marginBottom: space.sm,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    minHeight: 36,
    justifyContent: 'center',
  },
});
