import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FinanceCardSheet } from '@/components/finance/FinanceCardSheet';
import { FinanceCatalogSheet } from '@/components/finance/FinanceCatalogSheet';
import { FinanceMetricSheet } from '@/components/finance/FinanceMetricSheet';
import { FinanceMomentum } from '@/components/finance/FinanceMomentum';
import { FinanceOrbit } from '@/components/finance/FinanceOrbit';
import { FinanceProgressBar } from '@/components/finance/FinanceProgressBar';
import { FinanceRail } from '@/components/finance/FinanceRail';
import { FinanceVaultSheet } from '@/components/finance/FinanceVaultSheet';
import {
  CARD_CATALOG,
  CREDIT_CATALOG,
  VAULT_CATALOG,
  cardPoints,
  cashGoal,
  cashSlots,
  creditGoal,
  creditSlots,
  financeProgress,
  getCardItem,
  getCreditItem,
  getVaultItem,
  metricNum,
  moneyShort,
  namedCards,
  pointsShort,
  momentumTracks,
  rewardsGoal,
  rewardsSlots,
  vaultTotal,
  type FinanceNeed,
} from '@/data/finance';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { useKeel } from '@/store/keel-store';
import { space } from '@/theme';
import type { FinanceOrbitId } from '@/types';

type PickerTarget = FinanceOrbitId;

export default function FinanceScreen() {
  const { colors } = useResolvedTheme();
  const insets = useSafeAreaInsets();
  const {
    state,
    patchCredit,
    addCredit,
    removeCredit,
    patchFinanceCard,
    addFinanceCard,
    removeFinanceCard,
    patchVault,
    addVault,
    removeVault,
  } = useKeel();
  const [creditId, setCreditId] = useState<string | null>(null);
  const [cardId, setCardId] = useState<string | null>(null);
  const [vaultId, setVaultId] = useState<string | null>(null);
  const [picker, setPicker] = useState<PickerTarget | null>(null);
  const [peekId, setPeekId] = useState<string | null>(null);

  const score = metricNum(state.finance, 'score');
  const util = metricNum(state.finance, 'utilization');
  const streak = metricNum(state.finance, 'on-time');
  const points = cardPoints(state.finance);
  const cash = vaultTotal(state.finance);
  const cards = namedCards(state.finance).length;
  const credit = useMemo(() => creditGoal(state.finance), [state.finance]);
  const rewards = useMemo(() => rewardsGoal(state.finance), [state.finance]);
  const stash = useMemo(() => cashGoal(state.finance), [state.finance]);
  const creditOrbit = useMemo(() => creditSlots(state.finance), [state.finance]);
  const rewardsOrbit = useMemo(() => rewardsSlots(state.finance), [state.finance]);
  const cashOrbit = useMemo(() => cashSlots(state.finance), [state.finance]);
  const progress = useMemo(() => financeProgress(state.finance), [state.finance]);
  const momentum = useMemo(() => momentumTracks(state.finance), [state.finance]);
  const nextNode = progress.nodes.find((node) => node.status === 'next');
  const peekNode = progress.nodes.find((node) => node.circle.id === peekId) ?? nextNode;

  const activeCredit = state.finance.credit.find((item) => item.id === creditId);
  const activeCard =
    state.finance.cards.find((item) => item.id === cardId) ??
    (cardId?.startsWith('card_')
      ? { id: cardId, catalogId: cardId.replace('card_', ''), name: '', reward: '', points: '', note: '' }
      : undefined);
  const activeVault = state.finance.vaults.find((item) => item.id === vaultId);
  const creditTitle = activeCredit ? (getCreditItem(activeCredit.catalogId)?.label ?? 'Score') : '';
  const cardTitle = activeCard ? (getCardItem(activeCard.catalogId)?.label ?? 'Card') : '';
  const vaultTitle = activeVault ? (getVaultItem(activeVault.catalogId)?.label ?? 'Cash') : '';

  const openNeed = (need: FinanceNeed) => {
    if (need.orbit === 'credit') {
      const row = state.finance.credit.find((item) => item.catalogId === need.catalogId);
      if (row) setCreditId(row.id);
      else {
        addCredit(need.catalogId);
        setCreditId(`credit_${need.catalogId}`);
      }
      return;
    }
    if (need.orbit === 'cards') {
      const row = state.finance.cards.find((item) => item.catalogId === need.catalogId);
      if (row) setCardId(row.id);
      else {
        addFinanceCard(need.catalogId);
        setCardId(`card_${need.catalogId}`);
      }
      return;
    }
    const row = state.finance.vaults.find((item) => item.catalogId === need.catalogId);
    if (row) setVaultId(row.id);
    else {
      addVault(need.catalogId);
      setVaultId(`vault_${need.catalogId}`);
    }
  };

  const extras =
    picker === 'credit'
      ? CREDIT_CATALOG.filter((item) => !state.finance.credit.some((row) => row.catalogId === item.id))
      : picker === 'cards'
        ? CARD_CATALOG.filter((item) => !state.finance.cards.some((row) => row.catalogId === item.id))
        : picker === 'grow'
          ? VAULT_CATALOG.filter((item) => !state.finance.vaults.some((row) => row.catalogId === item.id))
          : [];

  const openCard = (id: string) => {
    if (!state.finance.cards.some((item) => item.id === id) && id.startsWith('card_')) {
      addFinanceCard(id.replace('card_', ''));
    }
    setCardId(id);
  };

  return (
    <View style={[styles.shell, { backgroundColor: colors.background, paddingTop: Math.max(insets.top, space.lg) }]}>
      <FinanceProgressBar progress={progress} peek={peekNode} onPeek={setPeekId} onPressNeed={openNeed} />
      <View style={styles.row}>
        <FinanceRail
          align="left"
          items={[
            { label: 'Score', value: score === undefined ? '—' : String(Math.round(score)) },
            { label: 'Util', value: util === undefined ? '—' : `${Math.round(util)}%` },
            { label: 'Streak', value: streak === undefined ? '—' : `${Math.round(streak)}` },
          ]}
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.page}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <FinanceOrbit
            title="Credit"
            current={credit.current}
            goal={credit.goal}
            done={credit.done}
            slots={creditOrbit}
            onPressSlot={setCreditId}
            onAdd={() => setPicker('credit')}
          />
          <FinanceOrbit
            title="Rewards"
            current={rewards.current}
            goal={rewards.goal}
            done={rewards.done}
            slots={rewardsOrbit}
            onPressSlot={openCard}
            onAdd={() => setPicker('cards')}
          />
          <FinanceOrbit
            title="Grow"
            current={stash.current}
            goal={stash.goal}
            done={stash.done}
            slots={cashOrbit}
            onPressSlot={setVaultId}
            onAdd={() => setPicker('grow')}
          />
          <FinanceMomentum
            tracks={momentum}
            onPressTrack={(track) =>
              openNeed({
                label: track.label,
                hint: '',
                orbit: track.orbit,
                catalogId: track.catalogId,
                met: false,
              })
            }
          />
        </ScrollView>
        <FinanceRail
          align="right"
          items={[
            { label: 'Pts', value: points ? pointsShort(points) : '—' },
            { label: 'Cash', value: cash ? moneyShort(cash) : '—' },
            { label: 'Cards', value: String(cards) },
          ]}
        />
      </View>
      <FinanceMetricSheet
        open={Boolean(activeCredit)}
        title={creditTitle}
        hint={
          activeCredit?.catalogId === 'score'
            ? '300–850. Next gates are 670, 740, then 800.'
            : activeCredit?.catalogId === 'utilization'
              ? 'Balances ÷ limits. Next gate is 30%.'
              : activeCredit?.catalogId === 'on-time'
                ? 'Months in a row with no late payment. Next gate is 12.'
                : undefined
        }
        value={activeCredit?.value ?? ''}
        note={activeCredit?.note ?? ''}
        unit={activeCredit ? getCreditItem(activeCredit.catalogId)?.unit : undefined}
        canRemove={Boolean(activeCredit && !getCreditItem(activeCredit.catalogId)?.preset)}
        onClose={() => setCreditId(null)}
        onSave={(next) => {
          if (activeCredit) patchCredit(activeCredit.id, next);
        }}
        onRemove={activeCredit ? () => removeCredit(activeCredit.id) : undefined}
      />
      <FinanceCardSheet
        open={Boolean(activeCard)}
        title={cardTitle}
        hint="Name the card. Points sit in the right margin."
        name={activeCard?.name ?? ''}
        reward={activeCard?.reward ?? ''}
        points={activeCard?.points ?? ''}
        note={activeCard?.note ?? ''}
        canRemove={Boolean(activeCard && !getCardItem(activeCard.catalogId)?.preset)}
        onClose={() => setCardId(null)}
        onSave={(next) => {
          if (!activeCard) return;
          if (!state.finance.cards.some((item) => item.id === activeCard.id)) {
            addFinanceCard(activeCard.catalogId);
          }
          patchFinanceCard(activeCard.id, next);
        }}
        onRemove={activeCard ? () => removeFinanceCard(activeCard.id) : undefined}
      />
      <FinanceVaultSheet
        open={Boolean(activeVault)}
        title={vaultTitle}
        spend={activeVault?.catalogId === 'spend'}
        hint={
          activeVault?.catalogId === 'spend'
            ? 'A quiet month. Cash goal becomes 3× this number.'
            : activeVault?.catalogId === 'emergency'
              ? 'Cash you can reach this week. Gates are $100, $1,000, then 3× monthly costs.'
              : activeVault?.catalogId === 'brokerage'
                ? 'Balance plus a monthly add.'
                : undefined
        }
        amount={activeVault?.amount ?? ''}
        monthly={activeVault?.monthly ?? ''}
        note={activeVault?.note ?? ''}
        canRemove={Boolean(activeVault && !getVaultItem(activeVault.catalogId)?.preset)}
        onClose={() => setVaultId(null)}
        onSave={(next) => {
          if (activeVault) patchVault(activeVault.id, next);
        }}
        onRemove={activeVault ? () => removeVault(activeVault.id) : undefined}
      />
      <FinanceCatalogSheet
        open={picker !== null}
        title={picker === 'credit' ? 'Add a number' : picker === 'cards' ? 'Add a card' : 'Add cash'}
        items={extras}
        onClose={() => setPicker(null)}
        onPick={(catalogId) => {
          if (picker === 'credit') {
            addCredit(catalogId);
            setPicker(null);
            setCreditId(`credit_${catalogId}`);
            return;
          }
          if (picker === 'cards') {
            addFinanceCard(catalogId);
            setPicker(null);
            setCardId(`card_${catalogId}`);
            return;
          }
          addVault(catalogId);
          setPicker(null);
          setVaultId(`vault_${catalogId}`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  scroll: {
    flex: 1,
  },
  page: {
    flexGrow: 1,
    gap: space.xl,
    paddingBottom: space.xxl,
    paddingTop: space.sm,
  },
});
