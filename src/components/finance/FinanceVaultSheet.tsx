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
  spend?: boolean;
  amount: string;
  monthly: string;
  note: string;
  canRemove?: boolean;
  onClose: () => void;
  onSave: (next: { amount: string; monthly: string; note: string }) => void;
  onRemove?: () => void;
};

export function FinanceVaultSheet({
  open,
  title,
  hint,
  spend,
  amount,
  monthly,
  note,
  canRemove,
  onClose,
  onSave,
  onRemove,
}: Props) {
  const { colors } = useResolvedTheme();
  const insets = useSafeAreaInsets();
  const [nextAmount, setNextAmount] = useState(amount);
  const [nextMonthly, setNextMonthly] = useState(monthly);
  const [nextNote, setNextNote] = useState(note);

  useEffect(() => {
    if (!open) return;
    setNextAmount(amount);
    setNextMonthly(monthly);
    setNextNote(note);
  }, [open, amount, monthly, note]);

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
            Cash
          </AppText>
          <AppText variant="title">{title}</AppText>
          {hint ? (
            <AppText variant="body" tone="muted">
              {hint}
            </AppText>
          ) : null}
          <TextField
            compact
            value={nextAmount}
            onChangeText={setNextAmount}
            placeholder={spend ? 'Monthly costs' : 'Balance'}
            keyboardType="decimal-pad"
          />
          {spend ? null : (
            <TextField
              compact
              value={nextMonthly}
              onChangeText={setNextMonthly}
              placeholder="Monthly add"
              keyboardType="decimal-pad"
            />
          )}
          <TextField compact value={nextNote} onChangeText={setNextNote} placeholder="Note" />
          <Button
            label="Save"
            onPress={() => {
              onSave({
                amount: nextAmount.trim(),
                monthly: spend ? '' : nextMonthly.trim(),
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
