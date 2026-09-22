import { useColorScheme } from 'react-native';

import { useKeel } from '@/store/keel-store';
import { themes } from '@/theme';
import type { ThemeName } from '@/types';

export function useResolvedTheme() {
  const system = useColorScheme();
  const { state } = useKeel();
  const name: ThemeName =
    state.settings.appearance === 'system'
      ? system === 'dark'
        ? 'dark'
        : 'light'
      : state.settings.appearance;

  return { name, colors: themes[name] };
}
