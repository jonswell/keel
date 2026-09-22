import type { ThemeName } from '@/types';

export const palette = {
  paper: '#F3EBDC',
  paperLift: '#FFF8ED',
  ink: '#1A1714',
  inkMuted: '#6B6358',
  line: '#D8CFC0',
  sea: '#163A36',
  seaSoft: '#2F6F68',
  brass: '#8A6B1F',
  brassSoft: '#C4A35A',
  clay: '#B3471D',
  night: '#121614',
  nightLift: '#1C221F',
  fog: '#EDE6D8',
  fogMuted: '#A39A8C',
  nightLine: '#2A322E',
  nightSea: '#8FBFB6',
  nightBrass: '#D4B45A',
  nightClay: '#E07A45',
};

export type ThemeColors = {
  background: string;
  surface: string;
  well: string;
  text: string;
  muted: string;
  line: string;
  accent: string;
  accentSoft: string;
  action: string;
  tabBar: string;
  webCanvas: string;
  overlay: string;
};

export const themes: Record<ThemeName, ThemeColors> = {
  light: {
    background: palette.paper,
    surface: palette.paperLift,
    well: '#D9CBB4',
    text: palette.ink,
    muted: palette.inkMuted,
    line: palette.line,
    accent: palette.sea,
    accentSoft: palette.seaSoft,
    action: palette.clay,
    tabBar: '#EBE2D2',
    webCanvas: '#0E1C1A',
    overlay: 'rgba(26, 23, 20, 0.06)',
  },
  dark: {
    background: palette.night,
    surface: palette.nightLift,
    well: '#2C3531',
    text: palette.fog,
    muted: palette.fogMuted,
    line: palette.nightLine,
    accent: palette.nightSea,
    accentSoft: palette.nightBrass,
    action: palette.nightClay,
    tabBar: '#161B19',
    webCanvas: '#070A09',
    overlay: 'rgba(237, 230, 216, 0.06)',
  },
};
