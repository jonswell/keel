import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { space } from '@/theme';

type Props = {
  kicker: string;
  title: string;
  detail?: string;
};

export function Header({ kicker, title, detail }: Props) {
  const { colors } = useResolvedTheme();

  return (
    <View style={styles.wrap}>
      <AppText variant="overline" tone="accent">
        {kicker}
      </AppText>
      <AppText variant="display">{title}</AppText>
      {detail ? (
        <AppText variant="caption" tone="muted">
          {detail}
        </AppText>
      ) : null}
      <View style={[styles.rule, { backgroundColor: colors.accentSoft }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: space.sm,
    paddingTop: space.sm,
  },
  rule: {
    width: 48,
    height: 2,
    marginTop: space.sm,
  },
});
