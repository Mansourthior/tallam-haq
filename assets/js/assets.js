// assets.js
import { Image } from 'react-native';

// Précharger les images
const bgDark = require('../images/bg-dark.jpeg');
const bgLight = require('../images/bg-white.jpg');

// Précharger explicitement
Image.prefetch(Image.resolveAssetSource(bgDark).uri);
Image.prefetch(Image.resolveAssetSource(bgLight).uri);

export const assets = {
  bgDark,
  bgLight
};