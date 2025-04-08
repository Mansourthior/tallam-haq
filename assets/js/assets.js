// assets.js
import { Image } from 'react-native';

// Précharger les images
const bgDark = require('../images/bg-dark.jpeg');
const bgLight = require('../images/bg-white.jpg');
const icon = require('../images/icon.png');
const coranSlider = require('../images/coran-slider.png');
const biblioSlider = require('../images/biblio-slider.png');
const hadithSlider = require('../images/hadith-slider.png');

// Précharger explicitement
Image.prefetch(Image.resolveAssetSource(bgDark).uri);
Image.prefetch(Image.resolveAssetSource(bgLight).uri);
Image.prefetch(Image.resolveAssetSource(icon).uri);
Image.prefetch(Image.resolveAssetSource(coranSlider).uri);
Image.prefetch(Image.resolveAssetSource(biblioSlider).uri);
Image.prefetch(Image.resolveAssetSource(hadithSlider).uri);

export const assets = {
  bgDark,
  bgLight,
  icon,
  coranSlider,
  biblioSlider,
  hadithSlider
};