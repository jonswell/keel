import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import type { Person } from '@/types';

type Props = {
  person: Person;
  size: number;
  onLongPress?: () => void;
};

export function AvatarBubble({ person, size, onLongPress }: Props) {
  const { colors } = useResolvedTheme();

  return (
    <Pressable
      onLongPress={onLongPress}
      accessibilityRole="imagebutton"
      accessibilityLabel={person.name}
      style={[
        styles.bubble,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: `hsl(${person.hue}, 42%, 26%)`,
          borderColor: colors.surface,
        },
      ]}>
      <AppText variant="bodyBold" style={{ fontSize: size * 0.32, color: colors.surface, letterSpacing: 0.4 }}>
        {person.initials}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bubble: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
});
