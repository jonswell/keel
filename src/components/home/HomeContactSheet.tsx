import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { contactsAvailable, pickDeviceContact } from '@/lib/contacts';
import { tapLight } from '@/lib/haptics';
import { radius, space } from '@/theme';

type Props = {
  open: boolean;
  title: string;
  name: string;
  phone: string;
  note: string;
  canRemove?: boolean;
  onClose: () => void;
  onSave: (next: { name: string; phone: string; note: string }) => void;
  onRemove?: () => void;
};

export function HomeContactSheet({
  open,
  title,
  name,
  phone,
  note,
  canRemove,
  onClose,
  onSave,
  onRemove,
}: Props) {
  const { colors } = useResolvedTheme();
  const insets = useSafeAreaInsets();
  const [nextName, setNextName] = useState(name);
  const [nextPhone, setNextPhone] = useState(phone);
  const [nextNote, setNextNote] = useState(note);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setNextName(name);
    setNextPhone(phone);
    setNextNote(note);
    setError('');
  }, [open, name, phone, note]);

  const save = () => {
    onSave({ name: nextName.trim(), phone: nextPhone.trim(), note: nextNote.trim() });
    onClose();
  };

  const call = async () => {
    const digits = nextPhone.replace(/[^\d+]/g, '');
    if (!digits) return;
    tapLight();
    await Linking.openURL(`tel:${digits}`);
  };

  const fromContacts = async () => {
    tapLight();
    if (!contactsAvailable()) {
      setError('Contacts live on iPhone and Android. Type the name and number here.');
      return;
    }
    try {
      const picked = await pickDeviceContact();
      if (!picked) return;
      setNextName(picked.name);
      if (picked.phone) setNextPhone(picked.phone);
      setError('');
    } catch {
      setError('Could not open contacts. Type them in instead.');
    }
  };

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
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
          <View style={[styles.handle, { backgroundColor: colors.line }]} />
          <AppText variant="overline" tone="accent">
            Contact
          </AppText>
          <AppText variant="title">{title}</AppText>
          <TextField
            compact
            value={nextName}
            onChangeText={setNextName}
            placeholder="Name or company"
            autoCapitalize="words"
          />
          <TextField
            compact
            value={nextPhone}
            onChangeText={setNextPhone}
            placeholder="Phone"
            keyboardType="phone-pad"
            autoCapitalize="none"
          />
          <TextField compact value={nextNote} onChangeText={setNextNote} placeholder="Note" />
          {error ? (
            <AppText variant="caption" tone="action">
              {error}
            </AppText>
          ) : null}
          <Button label="Save" onPress={save} />
          {nextPhone.trim() ? <Button label="Call" variant="ghost" onPress={call} /> : null}
          <Button label="From contacts" variant="ghost" onPress={fromContacts} />
          {canRemove && onRemove ? (
            <Button
              label="Remove"
              variant="danger"
              onPress={() => {
                onRemove();
                onClose();
              }}
            />
          ) : null}
        </Pressable>
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
    gap: space.md,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 2,
    marginBottom: space.sm,
  },
});
