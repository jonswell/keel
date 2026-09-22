import type { HomeGlyphId, HomeInterval, HomeState, HomeTown, HomeTrade, HomeUpkeep } from '@/types';

export type HomeCatalogItem = {
  id: string;
  label: string;
  glyph: HomeGlyphId;
  preset?: boolean;
  interval?: HomeInterval;
};

export const TRADE_CATALOG: HomeCatalogItem[] = [
  { id: 'electrician', label: 'Electrician', glyph: 'bolt', preset: true },
  { id: 'plumber', label: 'Plumber', glyph: 'drop', preset: true },
  { id: 'hvac', label: 'HVAC', glyph: 'fan', preset: true },
  { id: 'landscape', label: 'Landscape', glyph: 'leaf', preset: true },
  { id: 'handyman', label: 'Handyman', glyph: 'wrench', preset: true },
  { id: 'pest', label: 'Pest control', glyph: 'bug' },
  { id: 'roofing', label: 'Roofing', glyph: 'roof' },
  { id: 'locksmith', label: 'Locksmith', glyph: 'key' },
  { id: 'painter', label: 'Painter', glyph: 'brush' },
  { id: 'chimney', label: 'Chimney', glyph: 'chimney' },
  { id: 'appliance', label: 'Appliances', glyph: 'fridge' },
];

export const TOWN_CATALOG: HomeCatalogItem[] = [
  { id: 'trash', label: 'Trash & recycling', glyph: 'bin', preset: true },
  { id: 'parking', label: 'Parking', glyph: 'parking', preset: true },
  { id: 'taxes', label: 'Taxes', glyph: 'tax', preset: true },
  { id: 'clerk', label: "Clerk's office", glyph: 'clerk', preset: true },
  { id: 'voting', label: 'Voting', glyph: 'vote', preset: true },
  { id: 'inquiries', label: 'Inquiries', glyph: 'ask', preset: true },
];

export const UPKEEP_CATALOG: HomeCatalogItem[] = [
  { id: 'hvac-filter', label: 'HVAC filter', glyph: 'filter', preset: true, interval: 'monthly' },
  { id: 'smoke', label: 'Smoke / CO', glyph: 'alarm', preset: true, interval: 'yearly' },
  { id: 'gutters', label: 'Gutters', glyph: 'gutter', preset: true, interval: 'yearly' },
  { id: 'water-heater', label: 'Water heater', glyph: 'heater', preset: true, interval: 'yearly' },
  { id: 'dryer-vent', label: 'Dryer vent', glyph: 'vent', preset: true, interval: 'yearly' },
  { id: 'chimney-sweep', label: 'Chimney', glyph: 'chimney', preset: true, interval: 'yearly' },
  { id: 'fridge-filter', label: 'Fridge filter', glyph: 'fridge', interval: 'monthly' },
  { id: 'extinguisher', label: 'Extinguisher', glyph: 'extinguisher', interval: 'yearly' },
  { id: 'ac-tune', label: 'AC tune-up', glyph: 'fan', interval: 'yearly' },
  { id: 'furnace', label: 'Furnace', glyph: 'heater', interval: 'yearly' },
];

export const HOME_INTERVALS: { id: HomeInterval; label: string }[] = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'quarterly', label: 'Quarterly' },
  { id: 'biannual', label: 'Twice a year' },
  { id: 'yearly', label: 'Yearly' },
];

export function getTradeItem(id: string): HomeCatalogItem | undefined {
  return TRADE_CATALOG.find((item) => item.id === id);
}

export function getTownItem(id: string): HomeCatalogItem | undefined {
  return TOWN_CATALOG.find((item) => item.id === id);
}

export function getUpkeepItem(id: string): HomeCatalogItem | undefined {
  return UPKEEP_CATALOG.find((item) => item.id === id);
}

function emptyTrade(item: HomeCatalogItem): HomeTrade {
  return { id: `trade_${item.id}`, catalogId: item.id, name: '', phone: '', note: '' };
}

function emptyTown(item: HomeCatalogItem): HomeTown {
  return { id: `town_${item.id}`, catalogId: item.id, name: '', phone: '', note: '' };
}

function emptyUpkeep(item: HomeCatalogItem): HomeUpkeep {
  return { id: `upkeep_${item.id}`, catalogId: item.id, interval: item.interval ?? 'yearly' };
}

export function emptyHome(): HomeState {
  return {
    trades: TRADE_CATALOG.filter((item) => item.preset).map(emptyTrade),
    town: TOWN_CATALOG.filter((item) => item.preset).map(emptyTown),
    upkeep: UPKEEP_CATALOG.filter((item) => item.preset).map(emptyUpkeep),
  };
}

function mergeContacts<T extends { id: string; catalogId: string }>(
  saved: T[] | undefined,
  presets: T[],
): T[] {
  const list = Array.isArray(saved) ? saved : [];
  const byId = new Map(list.map((item) => [item.id, item]));
  const byCatalog = new Map(list.map((item) => [item.catalogId, item]));
  const next = presets.map((preset) => byId.get(preset.id) ?? byCatalog.get(preset.catalogId) ?? preset);
  for (const item of list) {
    if (!next.some((row) => row.id === item.id || row.catalogId === item.catalogId)) next.push(item);
  }
  return next;
}

export function normalizeHome(home?: Partial<HomeState>): HomeState {
  const blank = emptyHome();
  return {
    trades: mergeContacts(home?.trades, blank.trades).map((item) => ({
      id: item.id,
      catalogId: item.catalogId,
      name: typeof item.name === 'string' ? item.name : '',
      phone: typeof item.phone === 'string' ? item.phone : '',
      note: typeof item.note === 'string' ? item.note : '',
    })),
    town: mergeContacts(home?.town, blank.town).map((item) => ({
      id: item.id,
      catalogId: item.catalogId,
      name: typeof item.name === 'string' ? item.name : '',
      phone: typeof item.phone === 'string' ? item.phone : '',
      note: typeof item.note === 'string' ? item.note : '',
    })),
    upkeep: mergeContacts(home?.upkeep, blank.upkeep).map((item) => {
      const interval: HomeInterval =
        item.interval === 'monthly' || item.interval === 'quarterly' || item.interval === 'biannual' || item.interval === 'yearly'
          ? item.interval
          : 'yearly';
      const nextAt =
        typeof item.nextAt === 'string' && Number.isFinite(Date.parse(item.nextAt)) ? item.nextAt : undefined;
      return { id: item.id, catalogId: item.catalogId, interval, nextAt };
    }),
  };
}

export function contactFilled(item: { name: string; phone: string }): boolean {
  return Boolean(item.name.trim() || item.phone.trim());
}

export function nextUpkeepAt(from: Date, interval: HomeInterval): Date {
  const next = new Date(from.getTime());
  switch (interval) {
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'quarterly':
      next.setMonth(next.getMonth() + 3);
      break;
    case 'biannual':
      next.setMonth(next.getMonth() + 6);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}

export function upkeepDueState(nextAt?: string): 'open' | 'soon' | 'due' | 'ok' {
  if (!nextAt) return 'open';
  const time = Date.parse(nextAt);
  if (!Number.isFinite(time)) return 'open';
  const days = (time - Date.now()) / 86_400_000;
  if (days < 0) return 'due';
  if (days < 14) return 'soon';
  return 'ok';
}
