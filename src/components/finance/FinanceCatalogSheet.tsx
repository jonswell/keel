import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FinanceGlyph } from '@/components/finance/FinanceGlyph';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import type { FinanceCatalogItem } from '@/data/finance';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { tapLight } from '@/lib/haptics';
import { radius, space } from '@/theme';

type Props = {
  open: boolean;
  title: string;
  items: FinanceCatalogItem[];
  onClose: () => void;
  onPick: (catalogId: string) => void;
};

export function FinanceCatalogSheet({ open, title, items, onClose, onPick }: Props) {
  const { colors } = useResolvedTheme();
  const insets = useSafeAreaInsets();

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
            Add
          </AppText>
          <AppText variant="title">{title}</AppText>
          <ScrollView style={styles.list} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {items.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => {
                  tapLight();
                  onPick(item.id);
                }}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                style={[styles.row, { borderColor: colors.line, backgroundColor: colors.surface }]}>
                <View style={[styles.mark, { backgroundColor: colors.well }]}>
                  <FinanceGlyph kind={item.glyph} size={18} color={colors.accent} />
                </View>
                <AppText variant="bodyBold">{item.label}</AppText>
              </Pressable>
            ))}
            {items.length === 0 ? (
              <AppText variant="body" tone="muted">
                Every option on this list is already on the circle.
              </AppText>
            ) : null}
          </ScrollView>
          <Button label="Close" variant="ghost" onPress={onClose} />
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
    maxHeight: '78%',
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 2,
    marginBottom: space.sm,
  },
  list: {
    maxHeight: 360,
  },
  row: {
    minHeight: 56,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    marginBottom: space.sm,
  },
  mark: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
