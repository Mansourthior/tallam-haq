import AsyncStorage from '@react-native-async-storage/async-storage';

// Enregistrer un bookmark
// @ts-ignore
export const saveBookmark = async (pdfId, page) => {
  try {
    await AsyncStorage.setItem(`bookmark_${pdfId}`, JSON.stringify(page));
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du bookmark', error);
  }
};

// Récupérer un bookmark
// @ts-ignore
export const loadBookmark = async (pdfId) => {
  try {
    const value = await AsyncStorage.getItem(`bookmark_${pdfId}`);
    return value ? JSON.parse(value) : 1; // page 1 par défaut
  } catch (error) {
    console.error('Erreur lors du chargement du bookmark', error);
    return 1;
  }
};
