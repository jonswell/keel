import Ionicons from '@expo/vector-icons/Ionicons';

import type { FinanceGlyphId } from '@/types';

const ICONS: Record<FinanceGlyphId, keyof typeof Ionicons.glyphMap> = {
  credit: 'shield-checkmark-outline',
  cards: 'card-outline',
  grow: 'trending-up-outline',
  score: 'speedometer-outline',
  meter: 'pie-chart-outline',
  calendar: 'calendar-outline',
  layers: 'layers-outline',
  search: 'search-outline',
  bag: 'wallet-outline',
  cart: 'cart-outline',
  dining: 'restaurant-outline',
  travel: 'airplane-outline',
  gas: 'car-outline',
  rotate: 'sync-outline',
  work: 'briefcase-outline',
  shield: 'shield-outline',
  cash: 'cash-outline',
  chart: 'stats-chart-outline',
  umbrella: 'umbrella-outline',
  seed: 'leaf-outline',
  school: 'school-outline',
  spend: 'receipt-outline',
};

type Props = {
  kind: FinanceGlyphId;
  size: number;
  color: string;
};

export function FinanceGlyph({ kind, size, color }: Props) {
  return <Ionicons name={ICONS[kind]} size={size} color={color} />;
}
