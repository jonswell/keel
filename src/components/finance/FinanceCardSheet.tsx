import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { radius, space } from '@/theme';

type Props = {
  open: boolean;
  title: string;
  hint?: string;
  name: string;
  reward: string;
  points: string;
  note: string;
  canRemove?: boolean;
  onClose: () => void;
  onSave: (next: { name: string; reward: string; points: string; note: string }) => void;
  onRemove?: () => void;
};

export function FinanceCardSheet({
  open,
  title,
  hint,
  name,
  reward,
  points,
  note,
  canRemove,
  onClose,
  onSave,
  onRemove,
}: Props) {
  const { colors } = useResolvedTheme();
  const insets = useSafeAreaInsets();
  const [nextName, setNextName] = useState(name);
  const [nextReward, setNextReward] = useState(reward);
  const [nextPoints, setNextPoints] = useState(points);
  const [nextNote, setNextNote] = useState(note);

  useEffect(() => {
    if (!open) return;
    setNextName(name);
    setNextReward(reward);
    setNextPoints(points);
    setNextNote(note);
  }, [open, name, reward, points, note]);

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
            Card
          </AppText>
          <AppText variant="title">{title}</AppText>
          {hint ? (
            <AppText variant="body" tone="muted">
              {hint}
            </AppText>
          ) : null}
          <TextField compact value={nextName} onChangeText={setNextName} placeholder="Card name" autoCapitalize="words" />
          <TextField
            compact
            value={nextReward}
            onChangeText={setNextReward}
            placeholder="3% / 2x"
            autoCapitalize="none"
          />
          <TextField
            compact
            value={nextPoints}
            onChangeText={setNextPoints}
            placeholder="Points"
            keyboardType="decimal-pad"
          />
          <TextField compact value={nextNote} onChangeText={setNextNote} placeholder="Note" />
          <Button
            label="Save"
            onPress={() => {
              onSave({
                name: nextName.trim(),
                reward: nextReward.trim(),
                points: nextPoints.trim(),
                note: nextNote.trim(),
              });
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
});
