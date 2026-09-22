import { Platform } from 'react-native';

export type PickedContact = {
  name: string;
  contactId?: string;
  phone?: string;
};

export function contactsAvailable(): boolean {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

export async function pickDeviceContact(): Promise<PickedContact | null> {
  if (!contactsAvailable()) return null;

  const { Contact, ContactField } = await import('expo-contacts');
  const picked = await Contact.presentPicker();
  if (!picked) return null;

  const details = await picked.getDetails([
    ContactField.FULL_NAME,
    ContactField.GIVEN_NAME,
    ContactField.FAMILY_NAME,
    ContactField.PHONES,
  ]);
  const name =
    details.fullName?.trim() ||
    [details.givenName, details.familyName].filter(Boolean).join(' ').trim() ||
    'Crew';
  const phone = details.phones?.[0]?.number?.trim();

  return { name, contactId: picked.id, phone };
}
