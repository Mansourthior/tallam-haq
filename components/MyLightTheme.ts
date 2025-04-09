import { Theme } from "@react-navigation/native";

const MyLightTheme: Theme = {
    dark: false,
    colors: {
      primary: '#2C6E63',         // Même vert que dans le DarkTheme, couleur principale
      background: '#F9F9F6',      // Très clair, légèrement sableux (blanc cassé chaud)
      card: '#FFFFFF',            // Blanc pur pour les cartes et surfaces
      text: '#1B2B29',            // Texte bien lisible, presque noir avec un ton verdâtre subtil
      border: '#E0E0DC',          // Gris clair sableux pour les bordures douces
      notification: '#D97706',    // Orange ambré, un peu plus doux que dans le dark
    },
  };

  export default MyLightTheme;
  