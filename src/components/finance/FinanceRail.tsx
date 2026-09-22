import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { space } from '@/theme';

export type FinanceRailItem = {
  label: string;
  value: string;
};

type Props = {
  items: FinanceRailItem[];
  align: 'left' | 'right';
};

export function FinanceRail({ items, align }: Props) {
  const { colors } = useResolvedTheme();

  return (
    <View style={[styles.rail, align === 'right' ? styles.right : styles.left]}>
      {items.map((item) => (
        <View key={item.label} style={styles.stat}>
          <AppText variant="overline" tone="muted" numberOfLines={1} style={styles.label}>
            {item.label}
          </AppText>
          <AppText variant="bodyBold" numberOfLines={1} style={[styles.value, { color: colors.text }]}>
            {item.value}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    width: 58,
    justifyContent: 'space-evenly',
    paddingVertical: space.lg,
    gap: space.xl,
  },
  left: {
    alignItems: 'flex-start',
    paddingLeft: 6,
  },
  right: {
    alignItems: 'flex-end',
    paddingRight: 6,
  },
  stat: {
    gap: 2,
    maxWidth: 52,
  },
  label: {
    letterSpacing: 1,
  },
  value: {
    fontSize: 15,
    lineHeight: 18,
  },
});
