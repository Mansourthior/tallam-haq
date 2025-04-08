import * as Clipboard from 'expo-clipboard';
import { ToastAndroid, Platform, Alert } from 'react-native';

export const copyToClipboard = async (text: string) => {
  await Clipboard.setStringAsync(text);

  if (Platform.OS === 'android') {
    ToastAndroid.show('Copié dans le presse-papiers', ToastAndroid.SHORT);
  } else {
    Alert.alert('Copié', 'Le texte a été copié dans le presse-papiers.');
  }
};
