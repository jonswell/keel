import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/teams/BrandMark';
import { ServiceMark } from '@/components/teams/ServiceMark';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { catalogMonthly } from '@/data/services';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { accessHeading } from '@/lib/access';
import { circleItems, type CircleItem } from '@/lib/circle';
import { tapLight } from '@/lib/haptics';
import { PAYMENT_OPTIONS } from '@/lib/pay';
import {
  defaultSplit,
  formatRequestOn,
  INTERVAL_OPTIONS,
  intervalCadence,
  intervalTotalLabel,
  money,
  nextRequestAt,
  shareAmount,
} from '@/lib/split';
import { fonts, radius, space } from '@/theme';
import type { CircleSplit, DiscountCode, PaymentRoute, ShareDetails, SplitInterval, Team } from '@/types';

type Props = {
  open: boolean;
  team?: Team;
  activeServiceId?: string;
  onClose: () => void;
  onChange: (split: CircleSplit) => void;
  onRemoveService: (serviceId: string) => void;
  onChangeDetails: (itemId: string, details: ShareDetails) => void;
  onChangeDiscount: (discount: DiscountCode) => void;
};

function emptyDetails(): ShareDetails {
  return { login: '', password: '', extra: '' };
}

function detailLabels(item: CircleItem): { login: string; secret: string; extra?: string; secretLocked: boolean } {
  if (item.kind === 'discount') {
    return { login: 'Login', secret: 'Code', extra: 'Note', secretLocked: false };
  }
  if (item.kind === 'source') {
    return { login: 'Login', secret: 'Password', extra: 'Link', secretLocked: true };
  }
  switch (item.service.category) {
    case 'invest':
      return { login: 'Login', secret: 'Password', extra: 'Account', secretLocked: true };
    case 'seats':
      return { login: 'Login', secret: 'Password', extra: 'Seats', secretLocked: true };
    case 'sports':
      return { login: 'Login', secret: 'Password', extra: 'League', secretLocked: true };
    case 'perks':
      return { login: 'Login', secret: 'Password', extra: 'Member ID', secretLocked: true };
    case 'work':
      return { login: 'Login', secret: 'Password', extra: 'Workspace', secretLocked: true };
    case 'resources':
      return { login: 'Login', secret: 'Password', extra: 'Member ID', secretLocked: true };
    case 'passes':
      return { login: 'Login', secret: 'Password', extra: 'Pass number', secretLocked: true };
    case 'stay':
    case 'fly':
      return { login: 'Login', secret: 'Password', extra: 'Loyalty number', secretLocked: true };
    default:
      return { login: 'Login', secret: 'Password', extra: 'Note', secretLocked: true };
  }
}

export function SplitSheet({
  open,
  team,
  activeServiceId,
  onClose,
  onChange,
  onRemoveService,
  onChangeDetails,
  onChangeDiscount,
}: Props) {
  const { colors } = useResolvedTheme();
  const insets = useSafeAreaInsets();
  const split = team?.split ?? defaultSplit();
  const items = circleItems(team);
  const [index, setIndex] = useState(0);
  const current = items[Math.min(index, Math.max(items.length - 1, 0))];
  const members = team?.members.length ?? 0;
  const catalog = catalogMonthly(team?.serviceIds ?? []);
  const [totalText, setTotalText] = useState('');
  const [login, setLogin] = useState('');
  const [secret, setSecret] = useState('');
  const [extra, setExtra] = useState('');

  const total = split.total !== undefined ? split.total : catalog;
  const share = shareAmount(total, split.ways);
  const splitting = split.mode === 'equal';
  const routeLabel = PAYMENT_OPTIONS.find((item) => item.id === split.route)?.label ?? 'None';
  const nextOn = formatRequestOn(split.nextAt);
  const canCycle = items.length > 1;
  const labels = current ? detailLabels(current) : null;

  useEffect(() => {
    if (!open) return;
    const start = items.findIndex((item) => item.id === activeServiceId);
    setIndex(start >= 0 ? start : 0);
    setTotalText(
      split.total !== undefined ? String(split.total) : catalog > 0 ? catalog.toFixed(2) : '',
    );
  }, [open, team?.id]);

  useEffect(() => {
    if (!open || !current) return;
    const saved = team?.detailsById?.[current.id] ?? emptyDetails();
    setLogin(saved.login);
    setSecret(current.kind === 'discount' ? current.discount.code : saved.password);
    setExtra(saved.extra);
  }, [open, current?.id, team?.id]);

  useEffect(() => {
    if (index >= items.length && items.length > 0) setIndex(items.length - 1);
  }, [index, items.length]);

  const cycle = (direction: -1 | 1) => {
    if (!canCycle) return;
    tapLight();
    setIndex((currentIndex) => (currentIndex + direction + items.length) % items.length);
  };

  const removeCurrent = () => {
    if (!current) return;
    tapLight();
    onRemoveService(current.id);
  };

  const saveDetails = (next: Partial<ShareDetails> & { secret?: string }) => {
    if (!current) return;
    const nextLogin = next.login ?? login;
    const nextSecret = next.secret ?? secret;
    const nextExtra = next.extra ?? extra;
    setLogin(nextLogin);
    setSecret(nextSecret);
    setExtra(nextExtra);
    if (current.kind === 'discount') {
      onChangeDiscount({ ...current.discount, code: nextSecret });
      onChangeDetails(current.id, { login: nextLogin, password: '', extra: nextExtra });
      return;
    }
    onChangeDetails(current.id, { login: nextLogin, password: nextSecret, extra: nextExtra });
  };

  const patch = (next: Partial<CircleSplit>) => {
    onChange({ ...split, ...next });
  };

  const setMode = (mode: CircleSplit['mode']) => {
    tapLight();
    patch({
      mode,
      ways: mode === 'equal' ? Math.max(members, 2) : split.ways,
      nextAt:
        mode === 'equal' && split.route !== 'none'
          ? split.nextAt ?? nextRequestAt(new Date(), split.interval).toISOString()
          : split.nextAt,
    });
  };

  const setWays = (ways: number) => {
    tapLight();
    patch({ ways: Math.min(12, Math.max(2, ways)) });
  };

  const setRoute = (route: PaymentRoute) => {
    tapLight();
    patch({
      route,
      nextAt:
        route === 'none' ? undefined : split.nextAt ?? nextRequestAt(new Date(), split.interval).toISOString(),
    });
  };

  const chooseInterval = (interval: SplitInterval) => {
    tapLight();
    patch({
      interval,
      nextAt: split.route === 'none' ? undefined : nextRequestAt(new Date(), interval).toISOString(),
    });
  };

  const commitTotal = (raw: string) => {
    const parsed = Number.parseFloat(raw.replace(/[^0-9.]/g, ''));
    if (!raw.trim()) {
      patch({ total: undefined });
      return;
    }
    if (!Number.isFinite(parsed) || parsed < 0) return;
    patch({ total: Math.round(parsed * 100) / 100 });
  };

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ width: '100%' }}>
          <Pressable
            onPress={() => undefined}
            style={[
              styles.sheet,
              {
                backgroundColor: colors.background,
                borderColor: colors.line,
                paddingBottom: Math.max(insets.bottom, space.xl),
              },
            ]}>
            <View style={[styles.handleBar, { backgroundColor: colors.line }]} />
            <View style={styles.logoRow}>
              <Pressable
                onPress={() => cycle(-1)}
                disabled={!canCycle}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Previous"
                style={styles.chevron}>
                <AppText style={[styles.chevronMark, { color: colors.muted, opacity: canCycle ? 1 : 0.28 }]}>
                  ‹
                </AppText>
              </Pressable>
              <View style={styles.logoBlock}>
                {current?.kind === 'service' ? (
                  <ServiceMark service={current.service} size={72} round />
                ) : current?.kind === 'source' ? (
                  <ServiceMark service={current.source} size={72} round />
                ) : current?.kind === 'discount' ? (
                  <BrandMark name={current.name} size={72} round />
                ) : (
                  <View style={[styles.logoPlaceholder, { backgroundColor: colors.well }]} />
                )}
                <AppText variant="overline" tone="accent">
                  {current?.name ?? 'This circle'}
                </AppText>
              </View>
              <Pressable
                onPress={() => cycle(1)}
                disabled={!canCycle}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Next"
                style={styles.chevron}>
                <AppText style={[styles.chevronMark, { color: colors.muted, opacity: canCycle ? 1 : 0.28 }]}>
                  ›
                </AppText>
              </Pressable>
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.body}>
              {current && labels ? (
                <View style={styles.block}>
                  <AppText variant="overline" tone="muted">
                    {accessHeading(current)}
                  </AppText>
                  <TextField
                    compact
                    value={login}
                    onChangeText={(value) => saveDetails({ login: value })}
                    placeholder={labels.login}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TextField
                    compact
                    value={secret}
                    onChangeText={(value) => saveDetails({ secret: value })}
                    placeholder={labels.secret}
                    autoCapitalize={current.kind === 'discount' ? 'characters' : 'none'}
                    autoCorrect={false}
                    secureTextEntry={labels.secretLocked}
                  />
                  {labels.extra ? (
                    <TextField
                      compact
                      value={extra}
                      onChangeText={(value) => saveDetails({ extra: value })}
                      placeholder={labels.extra}
                      autoCapitalize="none"
                    />
                  ) : null}
                </View>
              ) : null}

              <View style={styles.block}>
                <AppText variant="overline" tone="accent">
                  Split
                </AppText>
                <AppText variant="title">{team?.name.trim() || 'This circle'}</AppText>
              </View>
              <View style={styles.row}>
                <Chip
                  label="No split"
                  active={!splitting}
                  onPress={() => setMode('none')}
                />
                <Chip
                  label={splitting ? `Split ${split.ways} ways` : 'Split'}
                  active={splitting}
                  onPress={() => setMode('equal')}
                />
              </View>

              <View style={styles.block}>
                <AppText variant="overline" tone="muted">
                  {splitting ? intervalTotalLabel(split.interval) : 'Monthly total'}
                </AppText>
                <TextField
                  compact
                  value={totalText}
                  onChangeText={(value) => {
                    setTotalText(value);
                    commitTotal(value);
                  }}
                  placeholder={catalog > 0 ? catalog.toFixed(2) : '0.00'}
                  keyboardType="decimal-pad"
                />
                <AppText variant="caption" tone="muted">
                  {catalog > 0
                    ? `Catalog plans on this circle run about ${money(catalog)} / mo.`
                    : 'Set the bill for this circle. Points programs start at zero.'}
                </AppText>
              </View>

              {splitting ? (
                <>
                  <View style={styles.block}>
                    <AppText variant="overline" tone="muted">
                      Ways
                    </AppText>
                    <View style={styles.stepper}>
                      <Pressable
                        onPress={() => setWays(split.ways - 1)}
                        accessibilityRole="button"
                        accessibilityLabel="Fewer people"
                        style={[styles.step, { borderColor: colors.line, backgroundColor: colors.surface }]}>
                        <AppText variant="title">−</AppText>
                      </Pressable>
                      <AppText variant="display">{split.ways}</AppText>
                      <Pressable
                        onPress={() => setWays(split.ways + 1)}
                        accessibilityRole="button"
                        accessibilityLabel="More people"
                        style={[styles.step, { borderColor: colors.line, backgroundColor: colors.surface }]}>
                        <AppText variant="title">+</AppText>
                      </Pressable>
                    </View>
                    <AppText variant="caption" tone="muted">
                      {members > 0
                        ? members === split.ways
                          ? `Matches the ${members} people on this circle.`
                          : `${members} people on this circle.`
                        : 'Add people to the circle, or split anyway.'}
                    </AppText>
                  </View>

                  <View style={[styles.shareCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
                    <AppText variant="overline" tone="accent">
                      Each person
                    </AppText>
                    <AppText variant="display">{total > 0 ? money(share) : '—'}</AppText>
                    <AppText variant="caption" tone="muted">
                      {money(total)} {intervalCadence(split.interval)}, split {split.ways} ways
                    </AppText>
                  </View>

                  <View style={styles.block}>
                    <AppText variant="overline" tone="muted">
                      Automatic payment
                    </AppText>
                    <View style={styles.wrap}>
                      {PAYMENT_OPTIONS.map((option) => (
                        <Chip
                          key={option.id}
                          label={option.label}
                          active={split.route === option.id}
                          onPress={() => setRoute(option.id)}
                        />
                      ))}
                    </View>
                    {split.route !== 'none' ? (
                      <AppText variant="caption" tone="muted">
                        Requests go out to everyone in this circle.
                      </AppText>
                    ) : (
                      <AppText variant="caption" tone="muted">
                        Pick a route and each person in the circle is requested on a schedule.
                      </AppText>
                    )}
                  </View>

                  {split.route !== 'none' ? (
                    <View style={styles.block}>
                      <AppText variant="overline" tone="muted">
                        Interval
                      </AppText>
                      <View style={styles.wrap}>
                        {INTERVAL_OPTIONS.map((option) => (
                          <Chip
                            key={option.id}
                            label={option.label}
                            active={split.interval === option.id}
                            onPress={() => chooseInterval(option.id)}
                          />
                        ))}
                      </View>
                      <AppText variant="caption" tone="muted">
                        {split.route === 'zelle'
                          ? `${money(share)} goes to everyone in this circle ${intervalCadence(split.interval)} over Zelle${nextOn ? `. Next ${nextOn}` : ''}.`
                          : `${routeLabel} sends ${money(share)} to everyone in this circle ${intervalCadence(split.interval)}${nextOn ? `. Next ${nextOn}` : ''}.`}
                      </AppText>
                    </View>
                  ) : null}
                </>
              ) : (
                <AppText variant="body" tone="muted">
                  One person keeps the bill. Nothing is collected from the circle.
                </AppText>
              )}
              {current ? (
                <Button label={`Remove ${current.name}`} variant="danger" onPress={removeCurrent} />
              ) : null}
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const { colors } = useResolvedTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[
        styles.chip,
        {
          backgroundColor: active ? colors.accent : colors.surface,
          borderColor: active ? colors.accent : colors.line,
        },
      ]}>
      <AppText variant="caption" style={{ color: active ? colors.background : colors.text }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(14, 28, 26, 0.46)',
  },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: space.xl,
    paddingTop: space.md,
    maxHeight: '88%',
    gap: space.sm,
  },
  handleBar: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 2,
    marginBottom: space.sm,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space.sm,
  },
  logoBlock: {
    alignItems: 'center',
    gap: space.sm,
    flex: 1,
  },
  chevron: {
    width: 36,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronMark: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 38,
  },
  logoPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  body: {
    gap: space.lg,
    paddingBottom: space.md,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  block: {
    gap: space.sm,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.sm,
  },
  step: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareCard: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.lg,
    gap: 4,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    minHeight: 36,
    justifyContent: 'center',
  },
});
