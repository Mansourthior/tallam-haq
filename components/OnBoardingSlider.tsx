import { View, Text, Image, Pressable, Dimensions, FlatList, SafeAreaView } from 'react-native';
import { useState, useRef } from 'react';
import { Feather } from '@expo/vector-icons';
import { assets } from '../assets/js/assets';

// @ts-ignore
export default function OnboardingSlider({ onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const screenWidth = Dimensions.get('window').width;

    // Données d'onboarding - Ajoutez vos textes et descriptions
    const onboardingData = [
        {
            id: '1',
            title: 'Bienvenue dans Taraqqi',
            description: 'Une application complète pour votre pratique religieuse quotidienne, sans publicité.',
            image: assets.icon, // Remplacez par une image d'accueil adaptée
            icon: 'book-open'
        },
        {
            id: '2',
            title: 'Le Saint Coran',
            description: 'Accédez au Coran avec traduction et translittération. Ajoutez des versets à vos favoris pour les retrouver facilement.',
            image: assets.coranSlider, // Remplacez par une image du Coran
            icon: 'book'
        },
        {
            id: '3',
            title: 'Hadiths et enseignements',
            description: 'Découvrez les hadiths du Prophète ﷺ. Recherchez par thème ou par narrateur.',
            image: assets.hadithSlider, // Remplacez par une image représentant les hadiths
            icon: 'message-circle'
        },
        {
            id: '4',
            title: 'Bibliothèque islamique',
            description: 'Accédez à une collection de livres islamiques pour approfondir vos connaissances.',
            image: assets.biblioSlider, // Remplacez par une image de bibliothèque
            icon: 'layers'
        },
        {
            id: '5',
            title: 'Heures de prières',
            description: 'Consultez les horaires précis des prières quotidiennes selon votre localisation.',
            image: assets.salatSlider, // Remplacez par une image d'horaires de prière
            icon: 'clock'
        },
        {
            id: '6',
            title: 'Prêt à commencer',
            description: "Qu'Allah facilite votre pratique et enrichisse vos connaissances à travers cette application.",
            image: assets.handSlider, // Remplacez par une image de mosquée ou autre image inspirante
            icon: 'heart'
        }
    ];

    // Passer à la diapositive suivante
    const goToNextSlide = () => {
        if (currentIndex < onboardingData.length - 1) {
            // @ts-ignore
            flatListRef.current.scrollToIndex({
                index: currentIndex + 1,
                animated: true
            });
            setCurrentIndex(currentIndex + 1);
        } else {
            // Terminer l'onboarding
            onComplete && onComplete();
        }
    };

    // Passer à la diapositive précédente
    const goToPrevSlide = () => {
        if (currentIndex > 0) {
            // @ts-ignore
            flatListRef.current.scrollToIndex({
                index: currentIndex - 1,
                animated: true
            });
            setCurrentIndex(currentIndex - 1);
        }
    };

    // Sauter l'onboarding
    const skipOnboarding = () => {
        onComplete && onComplete();
    };

    // Rendu d'un élément du slider
    // @ts-ignore
    const renderItem = ({ item }) => (
        <View style={{ width: screenWidth }} className="items-center justify-center px-6">
            <Image
                source={item.image}
                className="w-64 h-64 rounded-full mb-8"
            />

            <Text className="font-[Poppins] text-2xl font-bold text-lime-800 mb-4 text-center">
                {item.title}
            </Text>

            <Text className="font-[Poppins] text-base text-lime-700 text-center mb-8 px-4">
                {item.description}
            </Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header avec bouton de saut */}
            <View className="flex-row justify-end p-4">
                {currentIndex < onboardingData.length - 1 && (
                    <Pressable onPress={skipOnboarding}>
                        <Text className="font-[Poppins] text-green-950 font-bold text-base p-2">Passer</Text>
                    </Pressable>
                )}
            </View>

            {/* Slider principal */}
            <FlatList
                ref={flatListRef}
                data={onboardingData}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                onMomentumScrollEnd={(event) => {
                    const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
                    setCurrentIndex(newIndex);
                }}
            />

            {/* Indicateurs de page */}
            <View className="flex-row justify-center my-6">
                {onboardingData.map((_, index) => (
                    <View
                        key={index}
                        className={`h-2 mx-1 rounded-full ${index === currentIndex ? 'w-6 bg-green-950' : 'w-2 bg-lime-200'
                            }`}
                    />
                ))}
            </View>

            {/* Boutons de navigation */}
            <View className="flex-row justify-between items-center px-8 pb-12">
                {currentIndex > 0 ? (
                    <Pressable onPress={goToPrevSlide} className="p-2">
                        <View className="flex-row items-center">
                            <Feather name="chevron-left" size={24} color="#4d7c0f" />
                            <Text className="font-[Poppins] text-green-950 ml-1 font-bold">Précédent</Text>
                        </View>
                    </Pressable>
                ) : (
                    <View className="w-24" />
                )}

                <Pressable
                    onPress={goToNextSlide}
                    className="bg-green-950 px-6 py-3 rounded-full flex-row items-center"
                >
                    <Text className="font-[Poppins] text-white mr-2 font-bold">
                        {currentIndex === onboardingData.length - 1 ? "Commencer" : "Suivant"}
                    </Text>
                    <Feather name="chevron-right" size={20} color="white" />
                </Pressable>
            </View>
        </SafeAreaView>
    );
}