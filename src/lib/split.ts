import type { CircleSplit, PaymentRoute, SplitInterval } from '@/types';

const ROUTES: PaymentRoute[] = ['none', 'venmo', 'cashapp', 'paypal', 'zelle'];
const INTERVALS: SplitInterval[] = ['weekly', 'biweekly', 'monthly', 'yearly'];

export const INTERVAL_OPTIONS: { id: SplitInterval; label: string; cadence: string }[] = [
  { id: 'weekly', label: 'Weekly', cadence: 'every week' },
  { id: 'biweekly', label: 'Every 2 weeks', cadence: 'every two weeks' },
  { id: 'monthly', label: 'Monthly', cadence: 'every month' },
  { id: 'yearly', label: 'Yearly', cadence: 'every year' },
];

export const defaultSplit = (): CircleSplit => ({
  mode: 'none',
  ways: 2,
  route: 'none',
  handle: '',
  interval: 'monthly',
});

export function normalizeSplit(split?: Partial<CircleSplit>): CircleSplit {
  const ways = Math.floor(split?.ways ?? 2);
  const interval = split?.interval && INTERVALS.includes(split.interval) ? split.interval : 'monthly';
  const nextAt =
    typeof split?.nextAt === 'string' && Number.isFinite(Date.parse(split.nextAt)) ? split.nextAt : undefined;
  return {
    mode: split?.mode === 'equal' ? 'equal' : 'none',
    ways: Math.min(12, Math.max(2, Number.isFinite(ways) ? ways : 2)),
    total: typeof split?.total === 'number' && Number.isFinite(split.total) ? split.total : undefined,
    route: split?.route && ROUTES.includes(split.route) ? split.route : 'none',
    handle: typeof split?.handle === 'string' ? split.handle : '',
    interval,
    nextAt,
  };
}

export function money(value: number): string {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function shareAmount(total: number, ways: number): number {
  if (ways < 1) return total;
  return Math.round((total / ways) * 100) / 100;
}

export function nextRequestAt(from: Date, interval: SplitInterval): Date {
  const next = new Date(from.getTime());
  switch (interval) {
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'biweekly':
      next.setDate(next.getDate() + 14);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}

export function intervalCadence(interval: SplitInterval): string {
  return INTERVAL_OPTIONS.find((item) => item.id === interval)?.cadence ?? 'every month';
}

export function intervalTotalLabel(interval: SplitInterval): string {
  switch (interval) {
    case 'weekly':
      return 'Weekly total';
    case 'biweekly':
      return 'Biweekly total';
    case 'yearly':
      return 'Yearly total';
    default:
      return 'Monthly total';
  }
}

export function formatRequestOn(iso?: string): string | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return undefined;
  const includeYear = date.getFullYear() !== new Date().getFullYear();
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: includeYear ? 'numeric' : undefined,
  }).format(date);
}
