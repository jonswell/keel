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
  value: string;
  note: string;
  placeholder?: string;
  unit?: string;
  canRemove?: boolean;
  onClose: () => void;
  onSave: (next: { value: string; note: string }) => void;
  onRemove?: () => void;
};

export function FinanceMetricSheet({
  open,
  title,
  hint,
  value,
  note,
  placeholder,
  unit,
  canRemove,
  onClose,
  onSave,
  onRemove,
}: Props) {
  const { colors } = useResolvedTheme();
  const insets = useSafeAreaInsets();
  const [nextValue, setNextValue] = useState(value);
  const [nextNote, setNextNote] = useState(note);

  useEffect(() => {
    if (!open) return;
    setNextValue(value);
    setNextNote(note);
  }, [open, value, note]);

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
            Score
          </AppText>
          <AppText variant="title">{title}</AppText>
          {hint ? (
            <AppText variant="body" tone="muted">
              {hint}
            </AppText>
          ) : null}
          <TextField
            compact
            value={nextValue}
            onChangeText={setNextValue}
            placeholder={placeholder ?? (unit ? `Number${unit === '%' ? ' (%)' : ''}` : 'Number')}
            keyboardType="decimal-pad"
          />
          <TextField compact value={nextNote} onChangeText={setNextNote} placeholder="Note" />
          <Button
            label="Save"
            onPress={() => {
              onSave({ value: nextValue.trim(), note: nextNote.trim() });
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
