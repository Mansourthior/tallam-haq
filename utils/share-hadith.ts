import { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';

let viewRef: any = null;

export const setShareViewRef = (ref: any) => {
  viewRef = ref;
};

export const onShare = async () => {
  if (!viewRef) return;

  try {
    const uri = await captureRef(viewRef, {
      format: 'png',
      quality: 1,
    });

    await Share.open({
      url: uri,
      type: 'image/png',
      failOnCancel: false,
    });
  } catch (error) {
    console.error('Erreur lors du partage :', error);
  }
};
