import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { clearbitLogoUrl } from '@/lib/clearbit';
import { fonts } from '@/theme';

type Props = {
  name: string;
  size: number;
  round?: boolean;
  glyph?: boolean;
  backgroundColor?: string;
  color?: string;
};

export function BrandMark({ name, size, round = false, glyph = false, backgroundColor, color }: Props) {
  const { colors } = useResolvedTheme();
  const url = clearbitLogoUrl(name, Math.round(size * 2));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [name, url]);

  const radius = round ? size / 2 : size * 0.28;
  const showImage = Boolean(url) && !failed;
  const fontSize = name.length > 12 ? size * 0.14 : name.length > 7 ? size * 0.2 : size * 0.26;

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={`${name} mark`}
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: glyph ? 0 : radius,
          backgroundColor: showImage ? colors.surface : backgroundColor ?? colors.well,
          borderWidth: round && !glyph ? 2 : 0,
          borderColor: '#FFF8ED',
        },
      ]}>
      {showImage ? (
        <Image
          source={{ uri: url as string }}
          style={{ width: size, height: size }}
          resizeMode="cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <AppText
          numberOfLines={2}
          style={{
            color: color ?? colors.text,
            fontFamily: fonts.bodyBold,
            fontSize,
            lineHeight: fontSize * 1.15,
            textAlign: 'center',
            paddingHorizontal: Math.max(4, size * 0.08),
          }}>
          {name}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
