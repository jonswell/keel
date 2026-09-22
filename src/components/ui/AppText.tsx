import { Text, type TextProps } from 'react-native';

import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { type } from '@/theme';

type Variant = keyof typeof type;

type Props = TextProps & {
  variant?: Variant;
  tone?: 'default' | 'muted' | 'accent' | 'action';
};

export function AppText({ variant = 'body', tone = 'default', style, ...props }: Props) {
  const { colors } = useResolvedTheme();
  const color =
    tone === 'muted'
      ? colors.muted
      : tone === 'accent'
        ? colors.accent
        : tone === 'action'
          ? colors.action
          : colors.text;

  return <Text {...props} style={[type[variant], { color }, style]} />;
}
