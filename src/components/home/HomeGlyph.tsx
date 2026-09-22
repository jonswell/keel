import Ionicons from '@expo/vector-icons/Ionicons';

import type { HomeGlyphId } from '@/types';

const ICONS: Record<HomeGlyphId, keyof typeof Ionicons.glyphMap> = {
  house: 'home-outline',
  town: 'business-outline',
  wrench: 'hammer-outline',
  bolt: 'flash-outline',
  drop: 'water-outline',
  fan: 'snow-outline',
  leaf: 'leaf-outline',
  bug: 'bug-outline',
  roof: 'home-outline',
  key: 'key-outline',
  brush: 'color-palette-outline',
  bin: 'trash-outline',
  parking: 'car-outline',
  tax: 'cash-outline',
  clerk: 'document-text-outline',
  vote: 'checkbox-outline',
  ask: 'help-circle-outline',
  filter: 'funnel-outline',
  alarm: 'notifications-outline',
  gutter: 'rainy-outline',
  heater: 'flame-outline',
  vent: 'sync-outline',
  chimney: 'flame-outline',
  fridge: 'cube-outline',
  extinguisher: 'warning-outline',
};

type Props = {
  kind: HomeGlyphId;
  size: number;
  color: string;
};

export function HomeGlyph({ kind, size, color }: Props) {
  return <Ionicons name={ICONS[kind]} size={size} color={color} />;
}
