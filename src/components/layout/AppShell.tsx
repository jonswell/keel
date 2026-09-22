import { Platform, StyleSheet, useWindowDimensions, View, type ViewProps } from 'react-native';

import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { layout, radius } from '@/theme';

export function AppShell({ children, style, ...props }: ViewProps) {
  const { colors } = useResolvedTheme();
  const { width } = useWindowDimensions();
  const framed = Platform.OS === 'web' && width > 560;

  return (
    <View style={[styles.canvas, { backgroundColor: colors.webCanvas }]} {...props}>
      <View
        style={[
          styles.frame,
          {
            backgroundColor: colors.background,
            maxWidth: Platform.OS === 'web' ? layout.maxWidth : undefined,
            alignSelf: 'center',
            borderRadius: framed ? radius.lg + 6 : 0,
            marginVertical: framed ? 24 : 0,
            maxHeight: framed ? '94%' : '100%',
            boxShadow: framed ? '0 28px 80px rgba(0, 0, 0, 0.38)' : undefined,
          },
          style,
        ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    alignItems: 'center',
  },
  frame: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
});
