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

import { AvatarBubble } from '@/components/teams/AvatarBubble';
import { BrandMark } from '@/components/teams/BrandMark';
import { ServiceMark } from '@/components/teams/ServiceMark';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { accessFieldLabels, accessHeading, emptyDetails, viaLine } from '@/lib/access';
import { circleItems } from '@/lib/circle';
import { tapLight } from '@/lib/haptics';
import { fonts, radius, space } from '@/theme';
import type { DiscountCode, ShareDetails, Team } from '@/types';

type Props = {
  open: boolean;
  team?: Team;
  onClose: () => void;
  onChangeDetails: (itemId: string, details: ShareDetails) => void;
  onChangeDiscount: (discount: DiscountCode) => void;
};

export function AccessSheet({ open, team, onClose, onChangeDetails, onChangeDiscount }: Props) {
  const { colors } = useResolvedTheme();
  const insets = useSafeAreaInsets();
  const items = circleItems(team);
  const [index, setIndex] = useState(0);
  const current = items[Math.min(index, Math.max(items.length - 1, 0))];
  const canCycle = items.length > 1;
  const labels = current ? accessFieldLabels(current) : null;
  const [login, setLogin] = useState('');
  const [secret, setSecret] = useState('');
  const [extra, setExtra] = useState('');

  useEffect(() => {
    if (!open) return;
    setIndex(0);
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
                  {current?.name ?? team?.name.trim() ?? 'This circle'}
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
              <View style={styles.block}>
                <AppText variant="title">{team?.name.trim() || 'Untitled circle'}</AppText>
                <AppText variant="caption" tone="muted">
                  {viaLine(team)}
                  {team?.hostName?.trim() ? ` · ${team.hostName.trim()} hosts` : ''}
                </AppText>
                {team?.description?.trim() ? (
                  <AppText variant="body" tone="muted">
                    {team.description.trim()}
                  </AppText>
                ) : null}
              </View>

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
              ) : (
                <AppText variant="body" tone="muted">
                  This circle shared people, not a login.
                </AppText>
              )}

              {team && team.members.length > 0 ? (
                <View style={styles.block}>
                  <AppText variant="overline" tone="muted">
                    On this circle
                  </AppText>
                  <View style={styles.people}>
                    {team.members.map((person) => (
                      <View key={person.id} style={styles.person}>
                        <AvatarBubble person={person} size={40} />
                        <AppText variant="caption" numberOfLines={1} style={styles.personName}>
                          {person.name}
                        </AppText>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

              <Button label="Close" variant="ghost" onPress={onClose} />
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
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
  block: {
    gap: space.sm,
  },
  people: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.md,
  },
  person: {
    alignItems: 'center',
    width: 64,
    gap: 4,
  },
  personName: {
    textAlign: 'center',
  },
});
