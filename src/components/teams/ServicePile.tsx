import { Pressable, StyleSheet, View } from 'react-native';

import { BrandMark } from '@/components/teams/BrandMark';
import { ServiceMark } from '@/components/teams/ServiceMark';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import type { CircleItem } from '@/lib/circle';
import { hueFromName } from '@/lib/grid';

type Props = {
  items: CircleItem[];
  combined: boolean;
  activeId?: string;
  size: number;
  onPress?: () => void;
};

const RIM = 3;
const STROKE = 2;
const SEAM = 1.5;

function mosaic(count: number, diameter: number) {
  if (count <= 1) return { width: diameter, height: diameter, mark: diameter * 0.55 };
  if (count === 2) {
    const width = (diameter - SEAM) / 2;
    return { width, height: diameter, mark: Math.min(width, diameter) * 0.46 };
  }
  if (count === 3) {
    const height = (diameter - SEAM) / 2;
    const width = (diameter - SEAM) / 2;
    return { width, height, mark: height * 0.46 };
  }
  if (count <= 4) {
    const cell = (diameter - SEAM) / 2;
    return { width: cell, height: cell, mark: cell * 0.44 };
  }
  const cell = (diameter - SEAM * 2) / 3;
  return { width: cell, height: cell, mark: cell * 0.42 };
}

function discountFill(name: string): string {
  return `hsl(${hueFromName(name)}, 22%, 28%)`;
}

function tileFill(item: CircleItem): string {
  if (item.kind === 'service') return item.service.bg;
  if (item.kind === 'source') return item.source.bg;
  return discountFill(item.name);
}

function TileMark({ item, size }: { item: CircleItem; size: number }) {
  if (item.kind === 'service') return <ServiceMark service={item.service} size={size} glyph />;
  if (item.kind === 'source') return <ServiceMark service={item.source} size={size} glyph />;
  return <BrandMark name={item.name} size={size} glyph color="#F4F1E6" />;
}

export function ServicePile({ items, combined, activeId, size, onPress }: Props) {
  const { colors } = useResolvedTheme();
  const active = items.find((item) => item.id === activeId) ?? items[0];
  if (!active) return null;

  const showAll = combined && items.length > 1;
  const face = size - (RIM + STROKE) * 2;
  const tile = mosaic(items.length, face);
  const label = showAll ? 'All services on this circle' : active.name;

  const faceView = showAll ? (
        <View
          style={[
            styles.medal,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: colors.well,
            },
          ]}>
          <View
            style={[
              styles.stroke,
              {
                width: size - RIM * 2,
                height: size - RIM * 2,
                borderRadius: (size - RIM * 2) / 2,
                backgroundColor: colors.accent,
              },
            ]}>
            <View
              style={[
                styles.disc,
                {
                  width: face,
                  height: face,
                  borderRadius: face / 2,
                  backgroundColor: colors.well,
                  gap: SEAM,
                },
              ]}>
              {items.map((item, index) => {
                const threeTop = items.length === 3 && index === 0;
                const width = threeTop ? face : tile.width;
                const height = tile.height;
                const fill = tileFill(item);
                return (
                  <View
                    key={item.id}
                    style={{
                      width,
                      height,
                      backgroundColor: fill,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <TileMark item={item} size={item.kind === 'discount' ? Math.min(width, height) * 0.86 : tile.mark} />
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      ) : active.kind === 'service' ? (
        <ServiceMark service={active.service} size={size} round />
      ) : active.kind === 'source' ? (
        <ServiceMark service={active.source} size={size} round />
      ) : (
        <BrandMark name={active.name} size={size} round />
      );

  if (!onPress) return faceView;

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
      {faceView}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  medal: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stroke: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disc: {
    overflow: 'hidden',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
