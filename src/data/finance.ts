import type { FinanceCard, FinanceGlyphId, FinanceMetric, FinanceOrbitId, FinanceState, FinanceVault } from '@/types';

export type FinanceCatalogItem = {
  id: string;
  label: string;
  glyph: FinanceGlyphId;
  preset?: boolean;
  unit?: string;
};

export const CREDIT_CATALOG: FinanceCatalogItem[] = [
  { id: 'score', label: 'Credit score', glyph: 'score', preset: true },
  { id: 'utilization', label: 'Utilization', glyph: 'meter', preset: true, unit: '%' },
  { id: 'on-time', label: 'On-time streak', glyph: 'calendar', preset: true, unit: 'mo' },
  { id: 'accounts', label: 'Open accounts', glyph: 'layers' },
  { id: 'inquiries', label: 'Hard inquiries', glyph: 'search' },
];

export const CARD_CATALOG: FinanceCatalogItem[] = [
  { id: 'everyday', label: 'Everyday', glyph: 'bag', preset: true },
  { id: 'groceries', label: 'Groceries', glyph: 'cart', preset: true },
  { id: 'dining', label: 'Dining', glyph: 'dining', preset: true },
  { id: 'travel', label: 'Travel', glyph: 'travel' },
  { id: 'gas', label: 'Gas', glyph: 'gas' },
  { id: 'rotating', label: 'Rotating', glyph: 'rotate' },
  { id: 'business', label: 'Business', glyph: 'work' },
];

export const VAULT_CATALOG: FinanceCatalogItem[] = [
  { id: 'emergency', label: 'Emergency fund', glyph: 'shield', preset: true },
  { id: 'hysa', label: 'High-yield savings', glyph: 'cash', preset: true },
  { id: 'spend', label: 'Monthly costs', glyph: 'spend', preset: true },
  { id: 'brokerage', label: 'Brokerage', glyph: 'chart', preset: true },
  { id: 'retirement', label: 'Workplace retirement', glyph: 'umbrella' },
  { id: 'ira', label: 'IRA', glyph: 'seed' },
  { id: '529', label: '529', glyph: 'school' },
];

const SCORE_GATES = [670, 740, 800, 850];
const POINT_GATES = [10_000, 50_000, 100_000, 250_000];

export type FinanceGoal = {
  current: string;
  goal: string;
  done: boolean;
};

export type FinanceSlotView = {
  id: string;
  catalogId: string;
  label: string;
  mark: string;
  glyph: FinanceGlyphId;
  filled: boolean;
  tone: 'open' | 'ok' | 'soon' | 'due';
};

export function getCreditItem(id: string): FinanceCatalogItem | undefined {
  return CREDIT_CATALOG.find((item) => item.id === id);
}

export function getCardItem(id: string): FinanceCatalogItem | undefined {
  return CARD_CATALOG.find((item) => item.id === id);
}

export function getVaultItem(id: string): FinanceCatalogItem | undefined {
  return VAULT_CATALOG.find((item) => item.id === id);
}

export function parseMoney(value?: string): number | undefined {
  const n = Number.parseFloat((value ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : undefined;
}

export function moneyShort(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 10_000) return `$${Math.round(value / 1000)}k`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${Math.round(value)}`;
}

export function pointsShort(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 10_000) return `${Math.round(value / 1000)}k`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(Math.round(value));
}

export function metricNum(state: FinanceState, catalogId: string): number | undefined {
  return parseMoney(state.credit.find((item) => item.catalogId === catalogId)?.value);
}

export function vaultAmount(state: FinanceState, catalogId: string): number | undefined {
  return parseMoney(state.vaults.find((item) => item.catalogId === catalogId)?.amount);
}

export function vaultMonthly(state: FinanceState, catalogId: string): number | undefined {
  return parseMoney(state.vaults.find((item) => item.catalogId === catalogId)?.monthly);
}

export function namedCards(state: FinanceState): FinanceCard[] {
  return state.cards.filter((item) => item.name.trim());
}

export function vaultTotal(state: FinanceState): number {
  return state.vaults.reduce((sum, item) => {
    if (item.catalogId === 'spend') return sum;
    return sum + (parseMoney(item.amount) ?? 0);
  }, 0);
}

export function cardPoints(state: FinanceState): number {
  return state.cards.reduce((sum, item) => sum + (parseMoney(item.points) ?? 0), 0);
}

export function metricFilled(item: FinanceMetric): boolean {
  return Boolean(item.value.trim());
}

export function cardFilled(item: FinanceCard): boolean {
  return Boolean(item.name.trim());
}

export function vaultFilled(item: FinanceVault): boolean {
  return Boolean(item.amount.trim() || item.monthly.trim());
}

export function runwayTarget(state: FinanceState): number {
  const spend = vaultAmount(state, 'spend');
  return spend && spend > 0 ? spend * 3 : 3000;
}

function nextGate(value: number | undefined, gates: number[]): number {
  if (value === undefined) return gates[0];
  return gates.find((gate) => value < gate) ?? gates[gates.length - 1];
}

export function creditGoal(state: FinanceState): FinanceGoal {
  const score = metricNum(state, 'score');
  const goal = nextGate(score, SCORE_GATES);
  return {
    current: score === undefined ? '—' : String(Math.round(score)),
    goal: String(goal),
    done: score !== undefined && score >= SCORE_GATES[SCORE_GATES.length - 1],
  };
}

export function rewardsGoal(state: FinanceState): FinanceGoal {
  const named = namedCards(state).length;
  const points = cardPoints(state);
  if (named < 2) {
    return { current: String(named), goal: '2', done: false };
  }
  const goal = nextGate(points, POINT_GATES);
  return {
    current: pointsShort(points),
    goal: pointsShort(goal),
    done: points >= POINT_GATES[POINT_GATES.length - 1],
  };
}

export function cashGoal(state: FinanceState): FinanceGoal {
  const total = vaultTotal(state);
  const emergency = vaultAmount(state, 'emergency') ?? 0;
  const runway = runwayTarget(state);
  const investing = ['brokerage', 'retirement', 'ira'].some(
    (id) => (vaultAmount(state, id) ?? 0) > 0 && (vaultMonthly(state, id) ?? 0) > 0,
  );
  const goal = cashGateAmount(state);
  return {
    current: total > 0 ? moneyShort(total) : '—',
    goal: moneyShort(goal),
    done: emergency >= runway && investing,
  };
}

export function monthlyFlow(state: FinanceState): number {
  return state.vaults.reduce((sum, item) => {
    if (item.catalogId === 'spend') return sum;
    return sum + (parseMoney(item.monthly) ?? 0);
  }, 0);
}

export function cashGateAmount(state: FinanceState): number {
  const total = vaultTotal(state);
  const emergency = vaultAmount(state, 'emergency') ?? 0;
  if (total < 100) return 100;
  if (emergency < 1000) return 1000;
  return runwayTarget(state);
}

export function flowGateAmount(state: FinanceState): number {
  const spend = vaultAmount(state, 'spend');
  if (spend && spend > 0) return Math.max(50, Math.round(spend * 0.1));
  return 50;
}

export type MomentumTrack = {
  id: 'flow' | 'util' | 'cash' | 'borrow' | 'invest';
  label: string;
  current?: number;
  line: number;
  max: number;
  invert: boolean;
  mark: string;
  orbit: FinanceOrbitId;
  catalogId: string;
};

const INVEST_IDS = ['brokerage', 'retirement', 'ira'] as const;

export function investMonthly(state: FinanceState): number {
  return INVEST_IDS.reduce((sum, id) => sum + (vaultMonthly(state, id) ?? 0), 0);
}

export function investGateAmount(state: FinanceState): number {
  const monthly = investMonthly(state);
  const spend = vaultAmount(state, 'spend');
  const tenth = spend && spend > 0 ? Math.max(50, Math.round(spend * 0.1)) : 50;
  if (monthly < tenth) return tenth;
  return Math.max(tenth * 2, 100);
}

export function momentumTracks(state: FinanceState): MomentumTrack[] {
  const flow = monthlyFlow(state);
  const flowLine = flowGateAmount(state);
  const util = metricNum(state, 'utilization');
  const cash = vaultTotal(state);
  const cashLine = cashGateAmount(state);
  const score = metricNum(state, 'score');
  const borrowLine = nextGate(score, SCORE_GATES);
  const invest = investMonthly(state);
  const investLine = investGateAmount(state);
  const flowVault =
    state.vaults.find((item) => item.catalogId !== 'spend' && (parseMoney(item.monthly) ?? 0) > 0)?.catalogId ?? 'hysa';

  return [
    {
      id: 'flow',
      label: 'Flow',
      current: flow > 0 ? flow : undefined,
      line: flowLine,
      max: Math.max(flowLine * 2, flow, 100),
      invert: false,
      mark: `${flow > 0 ? `+${moneyShort(flow)}` : '—'} / +${moneyShort(flowLine)}`,
      orbit: 'grow',
      catalogId: flowVault,
    },
    {
      id: 'util',
      label: 'Util',
      current: util,
      line: 30,
      max: 100,
      invert: true,
      mark: `${util === undefined ? '—' : `${Math.round(util)}%`} / 30%`,
      orbit: 'credit',
      catalogId: 'utilization',
    },
    {
      id: 'cash',
      label: 'Cash',
      current: cash > 0 ? cash : undefined,
      line: cashLine,
      max: Math.max(cashLine * 1.4, cash, cashLine),
      invert: false,
      mark: `${cash > 0 ? moneyShort(cash) : '—'} / ${moneyShort(cashLine)}`,
      orbit: 'grow',
      catalogId: 'emergency',
    },
    {
      id: 'borrow',
      label: 'Borrow',
      current: score,
      line: borrowLine,
      max: SCORE_GATES[SCORE_GATES.length - 1],
      invert: false,
      mark: `${score === undefined ? '—' : String(Math.round(score))} / ${borrowLine}`,
      orbit: 'credit',
      catalogId: 'score',
    },
    {
      id: 'invest',
      label: 'Invest',
      current: invest > 0 ? invest : undefined,
      line: investLine,
      max: Math.max(investLine * 2, invest, 100),
      invert: false,
      mark: `${invest > 0 ? `+${moneyShort(invest)}` : '—'} / +${moneyShort(investLine)}`,
      orbit: 'grow',
      catalogId: 'brokerage',
    },
  ];
}

export function creditSlots(state: FinanceState): FinanceSlotView[] {
  const score = metricNum(state, 'score');
  const scoreGate = nextGate(score, SCORE_GATES);
  return state.credit.map((item) => {
    const catalog = getCreditItem(item.catalogId);
    const value = metricNum(state, item.catalogId);
    let mark = '—';
    if (item.catalogId === 'score') mark = value === undefined ? String(scoreGate) : String(Math.round(value));
    else if (item.catalogId === 'utilization') mark = value === undefined ? '30%' : `${Math.round(value)}%`;
    else if (item.catalogId === 'on-time') mark = value === undefined ? '12' : String(Math.round(value));
    else mark = value === undefined ? '0' : String(Math.round(value));
    return {
      id: item.id,
      catalogId: item.catalogId,
      label: catalog?.label ?? item.catalogId,
      mark,
      glyph: catalog?.glyph ?? 'score',
      filled: metricFilled(item),
      tone: creditTone(item),
    };
  });
}

export function rewardsSlots(state: FinanceState): FinanceSlotView[] {
  return state.cards.map((item, index) => {
    const catalog = getCardItem(item.catalogId);
    const points = parseMoney(item.points);
    const filled = cardFilled(item);
    const mark = filled ? (points ? pointsShort(points) : String(index + 1)) : String(index + 1);
    return {
      id: item.id,
      catalogId: item.catalogId,
      label: catalog?.label ?? item.catalogId,
      mark,
      glyph: catalog?.glyph ?? 'bag',
      filled,
      tone: filled ? 'ok' : 'open',
    };
  });
}

export function cashSlots(state: FinanceState): FinanceSlotView[] {
  const emergency = vaultAmount(state, 'emergency') ?? 0;
  const runway = runwayTarget(state);
  let emergencyMark = '$100';
  if (emergency >= 100) emergencyMark = '$1k';
  if (emergency >= 1000) emergencyMark = moneyShort(runway);
  return state.vaults.map((item) => {
    const catalog = getVaultItem(item.catalogId);
    const amount = parseMoney(item.amount);
    const monthly = parseMoney(item.monthly);
    const filled = vaultFilled(item);
    let mark = '$';
    if (item.catalogId === 'emergency') mark = filled && amount ? moneyShort(amount) : emergencyMark;
    else if (item.catalogId === 'spend') mark = filled && amount ? `${moneyShort(amount)}` : '×3';
    else if (item.catalogId === 'brokerage' || item.catalogId === 'retirement' || item.catalogId === 'ira') {
      mark = monthly ? `+${moneyShort(monthly)}` : filled && amount ? moneyShort(amount) : '+/mo';
    } else mark = filled && amount ? moneyShort(amount) : '$';
    let tone: FinanceSlotView['tone'] = filled ? 'ok' : 'open';
    if (item.catalogId === 'emergency' && filled && emergency < 1000) tone = 'soon';
    return {
      id: item.id,
      catalogId: item.catalogId,
      label: catalog?.label ?? item.catalogId,
      mark,
      glyph: catalog?.glyph ?? 'cash',
      filled,
      tone,
    };
  });
}

export function creditTone(item: FinanceMetric): 'open' | 'ok' | 'soon' | 'due' {
  if (!metricFilled(item)) return 'open';
  if (item.catalogId === 'utilization') {
    const value = parseMoney(item.value);
    if (value !== undefined && value > 30) return 'due';
  }
  if (item.catalogId === 'score') {
    const value = parseMoney(item.value);
    if (value !== undefined && value < 670) return 'soon';
  }
  return 'ok';
}

function emptyMetric(item: FinanceCatalogItem): FinanceMetric {
  return { id: `credit_${item.id}`, catalogId: item.id, value: '', note: '' };
}

function emptyCard(item: FinanceCatalogItem): FinanceCard {
  return { id: `card_${item.id}`, catalogId: item.id, name: '', reward: '', points: '', note: '' };
}

function emptyVault(item: FinanceCatalogItem): FinanceVault {
  return { id: `vault_${item.id}`, catalogId: item.id, amount: '', monthly: '', note: '' };
}

export function emptyFinance(): FinanceState {
  return {
    credit: CREDIT_CATALOG.filter((item) => item.preset).map(emptyMetric),
    cards: CARD_CATALOG.filter((item) => item.preset).map(emptyCard),
    vaults: VAULT_CATALOG.filter((item) => item.preset).map(emptyVault),
  };
}

function mergeByCatalog<T extends { id: string; catalogId: string }>(saved: T[] | undefined, presets: T[]): T[] {
  const list = Array.isArray(saved) ? saved : [];
  const byId = new Map(list.map((item) => [item.id, item]));
  const byCatalog = new Map(list.map((item) => [item.catalogId, item]));
  const next = presets.map((preset) => byId.get(preset.id) ?? byCatalog.get(preset.catalogId) ?? preset);
  for (const item of list) {
    if (!next.some((row) => row.id === item.id || row.catalogId === item.catalogId)) next.push(item);
  }
  return next;
}

export function normalizeFinance(finance?: Partial<FinanceState>): FinanceState {
  const blank = emptyFinance();
  return {
    credit: mergeByCatalog(finance?.credit, blank.credit).map((item) => ({
      id: item.id,
      catalogId: item.catalogId,
      value: typeof item.value === 'string' ? item.value : '',
      note: typeof item.note === 'string' ? item.note : '',
    })),
    cards: mergeByCatalog(finance?.cards, blank.cards).map((item) => ({
      id: item.id,
      catalogId: item.catalogId,
      name: typeof item.name === 'string' ? item.name : '',
      reward: typeof item.reward === 'string' ? item.reward : '',
      points: typeof item.points === 'string' ? item.points : '',
      note: typeof item.note === 'string' ? item.note : '',
    })),
    vaults: mergeByCatalog(finance?.vaults, blank.vaults).map((item) => ({
      id: item.id,
      catalogId: item.catalogId,
      amount: typeof item.amount === 'string' ? item.amount : '',
      monthly: typeof item.monthly === 'string' ? item.monthly : '',
      note: typeof item.note === 'string' ? item.note : '',
    })),
  };
}

function utilOk(state: FinanceState): boolean {
  const value = metricNum(state, 'utilization');
  return value !== undefined && value <= 30;
}

function isInvesting(state: FinanceState): boolean {
  return ['brokerage', 'retirement', 'ira'].some(
    (id) => (vaultAmount(state, id) ?? 0) > 0 && (vaultMonthly(state, id) ?? 0) > 0,
  );
}

export type FinanceNeed = {
  label: string;
  hint: string;
  orbit: FinanceOrbitId;
  catalogId: string;
  met: boolean;
};

export type FinanceCircleDef = {
  id: string;
  name: string;
  blurb: string;
  glyph: FinanceGlyphId;
  gate: string;
  unlocked: (state: FinanceState) => boolean;
  needs: (state: FinanceState) => FinanceNeed[];
};

export const FINANCE_CIRCLES: FinanceCircleDef[] = [
  {
    id: 'spark',
    name: 'Score',
    blurb: 'Know the number.',
    glyph: 'score',
    gate: '670',
    unlocked: (state) => metricNum(state, 'score') !== undefined,
    needs: (state) => [
      {
        label: 'Log a score',
        hint: 'Tap the dashed score on Credit.',
        orbit: 'credit',
        catalogId: 'score',
        met: metricNum(state, 'score') !== undefined,
      },
    ],
  },
  {
    id: 'foothold',
    name: 'Balance',
    blurb: 'A first cushion so a surprise does not become a balance.',
    glyph: 'shield',
    gate: '$100',
    unlocked: (state) => metricNum(state, 'score') !== undefined && vaultTotal(state) >= 100,
    needs: (state) => [
      {
        label: 'Score logged',
        hint: 'Credit circle.',
        orbit: 'credit',
        catalogId: 'score',
        met: metricNum(state, 'score') !== undefined,
      },
      {
        label: '$100 set aside',
        hint: 'Tap $100 on Grow.',
        orbit: 'grow',
        catalogId: 'emergency',
        met: vaultTotal(state) >= 100,
      },
    ],
  },
  {
    id: 'charge',
    name: 'Charge',
    blurb: 'Credit starts paying you back.',
    glyph: 'bag',
    gate: '670',
    unlocked: (state) =>
      namedCards(state).length >= 1 && ((metricNum(state, 'score') ?? 0) >= 670 || utilOk(state)),
    needs: (state) => [
      {
        label: 'Name a card',
        hint: 'Tap 1 on Rewards.',
        orbit: 'cards',
        catalogId: 'everyday',
        met: namedCards(state).length >= 1,
      },
      {
        label: '670 or 30% util',
        hint: 'Tap 670 or 30% on Credit.',
        orbit: 'credit',
        catalogId: (metricNum(state, 'score') ?? 0) >= 670 ? 'utilization' : 'score',
        met: (metricNum(state, 'score') ?? 0) >= 670 || utilOk(state),
      },
    ],
  },
  {
    id: 'reserve',
    name: 'Reserve',
    blurb: 'A real emergency fund and quiet revolving credit.',
    glyph: 'cash',
    gate: '$1k',
    unlocked: (state) => (vaultAmount(state, 'emergency') ?? 0) >= 1000 && utilOk(state),
    needs: (state) => [
      {
        label: '$1,000 emergency',
        hint: 'Tap the cash placeholder on Grow.',
        orbit: 'grow',
        catalogId: 'emergency',
        met: (vaultAmount(state, 'emergency') ?? 0) >= 1000,
      },
      {
        label: 'Util at 30% or under',
        hint: 'Tap 30% on Credit.',
        orbit: 'credit',
        catalogId: 'utilization',
        met: utilOk(state),
      },
    ],
  },
  {
    id: 'rewards',
    name: 'Rewards',
    blurb: 'Spend maps onto cards on purpose.',
    glyph: 'cards',
    gate: '2',
    unlocked: (state) => {
      const named = new Set(namedCards(state).map((item) => item.catalogId));
      return namedCards(state).length >= 2 && named.has('everyday') && (named.has('groceries') || named.has('dining'));
    },
    needs: (state) => {
      const named = new Set(namedCards(state).map((item) => item.catalogId));
      return [
        {
          label: 'Two named cards',
          hint: 'Tap 2 on Rewards.',
          orbit: 'cards' as const,
          catalogId: 'groceries',
          met: namedCards(state).length >= 2,
        },
        {
          label: 'Groceries or dining covered',
          hint: 'Name a category card.',
          orbit: 'cards' as const,
          catalogId: named.has('groceries') ? 'dining' : 'groceries',
          met: named.has('everyday') && (named.has('groceries') || named.has('dining')),
        },
      ];
    },
  },
  {
    id: 'runway',
    name: 'Runway',
    blurb: 'Three months of costs sitting in cash.',
    glyph: 'umbrella',
    gate: '$3k',
    unlocked: (state) => (vaultAmount(state, 'emergency') ?? 0) >= runwayTarget(state),
    needs: (state) => [
      {
        label: `Emergency ${moneyShort(runwayTarget(state))}`,
        hint: 'Log monthly costs, then fill emergency to 3×.',
        orbit: 'grow',
        catalogId: 'emergency',
        met: (vaultAmount(state, 'emergency') ?? 0) >= runwayTarget(state),
      },
    ],
  },
  {
    id: 'yield',
    name: 'Yield',
    blurb: 'Money you will not need this year starts earning.',
    glyph: 'chart',
    gate: '+/mo',
    unlocked: (state) => isInvesting(state),
    needs: (state) => [
      {
        label: 'Monthly invest',
        hint: 'Tap +/mo on Grow.',
        orbit: 'grow',
        catalogId: 'brokerage',
        met: isInvesting(state),
      },
    ],
  },
  {
    id: 'compound',
    name: 'Compound',
    blurb: 'Prime credit, a cash runway, and a monthly invest.',
    glyph: 'grow',
    gate: '740',
    unlocked: (state) =>
      (metricNum(state, 'score') ?? 0) >= 740 &&
      (vaultAmount(state, 'emergency') ?? 0) >= runwayTarget(state) &&
      isInvesting(state),
    needs: (state) => [
      {
        label: 'Score 740',
        hint: 'Credit circle.',
        orbit: 'credit',
        catalogId: 'score',
        met: (metricNum(state, 'score') ?? 0) >= 740,
      },
      {
        label: 'Runway funded',
        hint: 'Grow circle.',
        orbit: 'grow',
        catalogId: 'emergency',
        met: (vaultAmount(state, 'emergency') ?? 0) >= runwayTarget(state),
      },
      {
        label: 'Monthly invest',
        hint: 'Grow circle.',
        orbit: 'grow',
        catalogId: 'brokerage',
        met: isInvesting(state),
      },
    ],
  },
];

export type FinanceNodeStatus = 'done' | 'next' | 'ahead';

export type FinanceNode = {
  circle: FinanceCircleDef;
  status: FinanceNodeStatus;
  needs: FinanceNeed[];
  metCount: number;
  total: number;
};

export type FinanceProgress = {
  current?: FinanceCircleDef;
  next?: FinanceCircleDef;
  nodes: FinanceNode[];
};

export function financeProgress(state: FinanceState): FinanceProgress {
  const unlocked = FINANCE_CIRCLES.map((circle) => circle.unlocked(state));
  let currentIndex = -1;
  for (let i = 0; i < unlocked.length; i += 1) {
    if (!unlocked[i]) break;
    currentIndex = i;
  }
  const nodes: FinanceNode[] = FINANCE_CIRCLES.map((circle, index) => {
    const needs = circle.needs(state);
    const status: FinanceNodeStatus =
      index <= currentIndex ? 'done' : index === currentIndex + 1 ? 'next' : 'ahead';
    return {
      circle,
      status,
      needs,
      metCount: needs.filter((need) => need.met).length,
      total: needs.length,
    };
  });
  return {
    current: currentIndex >= 0 ? FINANCE_CIRCLES[currentIndex] : undefined,
    next: FINANCE_CIRCLES[currentIndex + 1],
    nodes,
  };
}
