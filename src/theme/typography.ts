export const fonts = {
  display: 'Fraunces_700Bold',
  displayItalic: 'Fraunces_400Regular_Italic',
  displaySemibold: 'Fraunces_600SemiBold',
  body: 'AtkinsonHyperlegible_400Regular',
  bodyBold: 'AtkinsonHyperlegible_700Bold',
  mono: 'SpaceMono',
} as const;

export const type = {
  wordmark: { fontFamily: fonts.display, fontSize: 28, letterSpacing: 1.4, lineHeight: 32 },
  display: { fontFamily: fonts.display, fontSize: 34, letterSpacing: -0.6, lineHeight: 40 },
  course: { fontFamily: fonts.displayItalic, fontSize: 26, letterSpacing: -0.3, lineHeight: 34 },
  title: { fontFamily: fonts.displaySemibold, fontSize: 22, letterSpacing: -0.2, lineHeight: 28 },
  body: { fontFamily: fonts.body, fontSize: 17, lineHeight: 24 },
  bodyBold: { fontFamily: fonts.bodyBold, fontSize: 17, lineHeight: 24 },
  caption: { fontFamily: fonts.body, fontSize: 13, letterSpacing: 0.2, lineHeight: 18 },
  overline: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.6,
    lineHeight: 16,
    textTransform: 'uppercase' as const,
  },
};
