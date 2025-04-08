// favoritesService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clés pour le stockage des différents types de favoris
const PDF_FAVORITES = 'pdf_favorites';


export const loadFavorites = async () => {
  try {
    const storedFavorites = await AsyncStorage.getItem(PDF_FAVORITES);
    return storedFavorites !== null ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error(`Erreur lors du chargement des favoris (${PDF_FAVORITES}):`, error);
    return [];
  }
};


// @ts-ignore
export const saveFavorites = async (favorites) => {
  try {
    await AsyncStorage.setItem(PDF_FAVORITES, JSON.stringify(favorites));
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde des favoris (${PDF_FAVORITES}):`, error);
  }
};

// @ts-ignore
export const toggleFavorite = async (currentFavorites, id) => {
  let newFavorites;
  if (currentFavorites.includes(id)) {
    // @ts-ignore
    newFavorites = currentFavorites.filter(favId => favId !== id);
  } else {
    newFavorites = [...currentFavorites, id];
  }
  
  await saveFavorites(newFavorites);
  return newFavorites;
};

// @ts-ignore
export const isFavorite = (favorites, id) => {
  return favorites.includes(id);
};

// @ts-ignore
export const removeFavorite = async (currentFavorites, id) => {
    // @ts-ignore
  const newFavorites = currentFavorites.filter(favId => favId !== id);
  await saveFavorites(newFavorites);
  return newFavorites;
};

// @ts-ignore
export const getFavoriteItems = (items, favorites) => {
    // @ts-ignore
  return items.filter(item => favorites.includes(item.id));
};