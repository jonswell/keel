import { Pressable, StyleSheet, View } from 'react-native';

import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { tapLight } from '@/lib/haptics';

type Props = {
  checked: boolean;
  onToggle: () => void;
  label: string;
};

export function Checkbox({ checked, onToggle, label }: Props) {
  const { colors } = useResolvedTheme();

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
      hitSlop={8}
      onPress={() => {
        tapLight();
        onToggle();
      }}
      style={styles.hit}>
      <View
        style={[
          styles.box,
          {
            borderColor: checked ? colors.accentSoft : colors.line,
            backgroundColor: checked ? colors.accentSoft : 'transparent',
          },
        ]}>
        {checked ? <View style={[styles.mark, { backgroundColor: colors.background }]} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});
