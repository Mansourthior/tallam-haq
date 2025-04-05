import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'QURAN_FAVORITES';

export type FavoriteVerse = {
  sourate: string;  
  verse: number;
  text: string;
  fr: string;
};

export const loadFavorites = async (): Promise<Record<string, FavoriteVerse[]>> => {
  const json = await AsyncStorage.getItem(FAVORITES_KEY);
  return json ? JSON.parse(json) : {};
};

export const toggleFavorite = async (
  sourate: string,
  verse: number,
  text: string,
  fr: string
) => {
  const favorites = await loadFavorites();
  const current = favorites[sourate] || [];

  const exists = current.some((v) => v.verse === verse);

  if (exists) {
    favorites[sourate] = current.filter((v) => v.verse !== verse);
  } else {
    favorites[sourate] = [...current, { sourate, verse, text, fr }];
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

export const getAllFavoritesVersets = async (): Promise<FavoriteVerse[]> => {
    const all = await loadFavorites();
    const flatList: FavoriteVerse[] = [];
  
    Object.entries(all).forEach(([sourate, verses]) => {
      verses.forEach((v) => {
        flatList.push({
          ...v
        });
      });
    });
  
    return flatList;
  };
