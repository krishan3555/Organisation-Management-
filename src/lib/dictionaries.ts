import 'server-only';

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((m) => m.default),
  hi: () => import('@/dictionaries/hi.json').then((m) => m.default),
};

export type Locale = 'en' | 'hi';

export const getDictionary = async (locale: Locale) =>
  (dictionaries[locale] ?? dictionaries.en)();

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
