import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'QURAN_FAVORITES';

type FavoriteVerse = {
  verse: number;
  text_ar: string;
  text_fr: string;
};

export const loadFavorites = async (): Promise<Record<string, FavoriteVerse[]>> => {
  const json = await AsyncStorage.getItem(FAVORITES_KEY);
  return json ? JSON.parse(json) : {};
};

export const toggleFavorite = async (
  sourate: string,
  verse: number,
  text_ar: string,
  text_fr: string
) => {
  const favorites = await loadFavorites();
  const current = favorites[sourate] || [];

  const exists = current.some((v) => v.verse === verse);

  if (exists) {
    favorites[sourate] = current.filter((v) => v.verse !== verse);
  } else {
    favorites[sourate] = [...current, { verse, text_ar, text_fr }];
  }

  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

export const isFavorite = async (
  sourate: string,
  verse: number
): Promise<boolean> => {
  const favorites = await loadFavorites();
  return favorites[sourate]?.some((v) => v.verse === verse) ?? false;
};

export const getAllFavorites = async (): Promise<Record<string, FavoriteVerse[]>> => {
  return await loadFavorites();
};
