import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AccessSheet } from '@/components/access/AccessSheet';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { ServicePile } from '@/components/teams/ServicePile';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { joinKind, joinKindLabel, joinedTeams, peopleLine, viaLine } from '@/lib/access';
import { circleItems } from '@/lib/circle';
import { tapLight } from '@/lib/haptics';
import { useKeel } from '@/store/keel-store';
import { radius, space } from '@/theme';
import type { JoinKind, Team } from '@/types';

const FILTERS: { id: 'all' | JoinKind; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'service', label: 'Service' },
  { id: 'other', label: 'Other' },
];

export default function AccessScreen() {
  const { colors } = useResolvedTheme();
  const { state, setDetailsAt, setDiscountCodesAt } = useKeel();
  const [filter, setFilter] = useState<'all' | JoinKind>('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const joined = useMemo(() => joinedTeams(state.teams), [state.teams]);
  const rows = useMemo(() => {
    const list = filter === 'all' ? joined : joined.filter((team) => joinKind(team) === filter);
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [filter, joined]);
  const active = joined.find((team) => team.id === openId);

  const serviceCount = joined.filter((team) => joinKind(team) === 'service').length;
  const otherCount = joined.length - serviceCount;

  return (
    <Screen>
      <Header
        kicker="Access"
        title="Joined circles"
        detail="Logins, codes, and crews you were added to."
      />
      <View style={styles.row}>
        {FILTERS.map((item) => {
          const selected = filter === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => {
                tapLight();
                setFilter(item.id);
              }}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={[
                styles.chip,
                {
                  borderColor: selected ? colors.accent : colors.line,
                  backgroundColor: selected ? colors.overlay : 'transparent',
                },
              ]}>
              <AppText variant="bodyBold" tone={selected ? 'accent' : 'muted'}>
                {item.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      {rows.length === 0 ? (
        <Card style={styles.empty}>
          <AppText variant="overline" tone="accent">
            Nothing here
          </AppText>
          <AppText variant="title">No circles joined yet</AppText>
          <AppText variant="body" tone="muted">
            When someone shares a login, a seat, or a code with you, that circle lands in this list.
          </AppText>
        </Card>
      ) : (
        <View style={styles.list}>
          {filter === 'all' && serviceCount > 0 && otherCount > 0
            ? (['service', 'other'] as const).map((kind) => {
                const group = rows.filter((team) => joinKind(team) === kind);
                if (group.length === 0) return null;
                return (
                  <View key={kind} style={styles.group}>
                    <AppText variant="overline" tone="muted">
                      {joinKindLabel(kind)}
                    </AppText>
                    {group.map((team) => (
                      <AccessRow key={team.id} team={team} onPress={() => setOpenId(team.id)} />
                    ))}
                  </View>
                );
              })
            : rows.map((team) => <AccessRow key={team.id} team={team} onPress={() => setOpenId(team.id)} />)}
        </View>
      )}
      <AccessSheet
        open={Boolean(active)}
        team={active}
        onClose={() => setOpenId(null)}
        onChangeDetails={(itemId, details) => {
          if (!active) return;
          setDetailsAt(active.gridX, active.gridY, itemId, details);
        }}
        onChangeDiscount={(discount) => {
          if (!active) return;
          setDiscountCodesAt(
            active.gridX,
            active.gridY,
            active.discountCodes.map((item) => (item.id === discount.id ? discount : item)),
          );
        }}
      />
    </Screen>
  );
}

function AccessRow({ team, onPress }: { team: Team; onPress: () => void }) {
  const { colors } = useResolvedTheme();
  const items = circleItems(team);

  return (
    <Pressable
      onPress={() => {
        tapLight();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={`${team.name.trim() || 'Untitled circle'}, ${viaLine(team)}`}
      style={[styles.rowCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
      {items.length > 0 ? (
        <ServicePile items={items} combined={items.length > 1} size={52} />
      ) : (
        <View style={[styles.blank, { backgroundColor: colors.well, borderColor: colors.line }]} />
      )}
      <View style={styles.copy}>
        <AppText variant="bodyBold" numberOfLines={1}>
          {team.name.trim() || 'Untitled circle'}
        </AppText>
        <AppText variant="caption" tone="muted" numberOfLines={1}>
          {viaLine(team)}
        </AppText>
        <AppText variant="caption" tone="muted" numberOfLines={1}>
          {peopleLine(team)}
        </AppText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: space.sm,
    flexWrap: 'wrap',
  },
  chip: {
    minHeight: 44,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    justifyContent: 'center',
    borderWidth: 1,
  },
  list: {
    gap: space.lg,
  },
  group: {
    gap: space.md,
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.md,
    minHeight: 72,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  blank: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
  },
  empty: {
    gap: space.sm,
  },
});
