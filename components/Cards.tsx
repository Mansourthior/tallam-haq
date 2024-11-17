import React, {useEffect, useRef} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// @ts-ignore
const Card = ({ title, onPress, image }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Valeur d'animation pour le fondu
  const slideAnim = useRef(new Animated.Value(20)).current; // Valeur d'animation pour la montée

  useEffect(() => {
    // Animation de montée et de fondu
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true, // Utiliser le moteur natif d'animation
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true, // Utiliser le moteur natif d'animation
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);


  return (
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <LinearGradient
            colors={['rgba(255, 255, 255, 0.4)', 'transparent']}
            style={styles.shinyEffect}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        />
        <Animated.View
            style={[styles.imageContainer, {
              opacity: fadeAnim, // Application de l'animation de fondu
              transform: [{ translateY: slideAnim }], // Application de l'animation de montée
            }]}
        >
          <Image source={image} style={styles.image} />
        </Animated.View>
        <Animated.Text
            style={[styles.title, {
              opacity: fadeAnim, // Application de l'animation de fondu
              transform: [{ translateY: slideAnim }], // Application de l'animation de montée
            }]}
        >
          {title}
        </Animated.Text>
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 10,
    padding: 30,
    backgroundColor: '#ed8f68',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    position: 'relative', // nécessaire pour le positionnement absolu du shinyEffect
    overflow: 'hidden', // s'assure que le shinyEffect ne dépasse pas les bords arrondis
  },
  shinyEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 50, // applique la même bordure arrondie que la carte
    zIndex: 1, // s'assure que le shinyEffect est au-dessus de l'arrière-plan mais sous le contenu
  },
  imageContainer: {
    zIndex: 2, // s'assure que l'image soit au-dessus de l'effet shiny
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    marginTop: 10,
    color: '#551c01',
      fontWeight: 'bold',
    zIndex: 2,
  },
});

export default Card;
