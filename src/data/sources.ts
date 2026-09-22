import type { ServiceMarkKind } from '@/data/services';

export type SharedSource = {
  id: string;
  name: string;
  bg: string;
  fg: string;
  mark: ServiceMarkKind;
  letter?: string;
  blurb: string;
};

export const SHARED_SOURCES: SharedSource[] = [
  {
    id: 'github',
    name: 'GitHub',
    bg: '#171B1F',
    fg: '#F4F1E6',
    mark: 'branch',
    blurb: 'The repo this circle works in. Keep the link and who can push here.',
  },
  {
    id: 'gdrive',
    name: 'Google Drive',
    bg: '#1E4A8A',
    fg: '#F4F8FF',
    mark: 'folder',
    blurb: 'The shared folder. Anyone on this circle should be able to open it.',
  },
  {
    id: 'asana',
    name: 'Asana',
    bg: '#8A3A32',
    fg: '#FDECEA',
    mark: 'spark',
    blurb: 'The project board for this objective. Add the people who move work.',
  },
  {
    id: 'figma',
    name: 'Figma',
    bg: '#1A1A1A',
    fg: '#F5F1EA',
    mark: 'letter',
    letter: 'F',
    blurb: 'The file for this circle. Keep the link so no one hunts for it.',
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    bg: '#0B3A6A',
    fg: '#E8F1FB',
    mark: 'box',
    blurb: 'The shared folder and the login. Who can drop files here.',
  },
  {
    id: 'airtable',
    name: 'Airtable',
    bg: '#1B3A4A',
    fg: '#D6EEF7',
    mark: 'bars',
    blurb: 'The base this crew edits. Keep the link and the people who write to it.',
  },
];

export function getSource(id: string): SharedSource | undefined {
  return SHARED_SOURCES.find((source) => source.id === id);
}

export function getSources(ids: string[]): SharedSource[] {
  return ids.map(getSource).filter((source): source is SharedSource => Boolean(source));
}
