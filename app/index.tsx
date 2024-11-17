import Card from '@/components/Cards';
import {StyleSheet, FlatList, View} from 'react-native';
import Header from "@/components/Header";
import { router } from 'expo-router';

export default function HomeScreen() {

  const sections = [
    { title: 'Bibliothèque', navigateTo: 'books', image: require('../assets/images/bibliotheque.png')},
    { title: 'Coran', navigateTo: 'sourates', image: require('../assets/images/quran.png')},
    { title: 'Hadiths', navigateTo: 'hadith', image: require('../assets/images/hadith.png')},
    { title: 'Fiqh', navigateTo: 'fiqh', image: require('../assets/images/fiqh.png')},
    { title: 'Aqidah', navigateTo: 'aqidah', image: require('../assets/images/tauhid.png')},
    { title: 'Tijaniya', navigateTo: 'soufisme', image: require('../assets/images/soufisme.png')},
    { title: 'Q&R', navigateTo: 'qr', image: require('../assets/images/questions.png')}
  ];

  const navigate = (route: string) => {
    // @ts-ignore
    router.replace(route);
  };
  // @ts-ignore
  const renderItem = ({ item }) => (
      <Card  title={item.title}
             onPress={() => navigate(item.navigateTo)}
             image={item.image} />
  );

  return (
      <View style={styles.container}>
        <Header title={'بسير زمانك سر'}/>
        <FlatList
            data={sections}
            renderItem={renderItem}
            keyExtractor={(item) => item.title}
            numColumns={2}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  list: {
    padding: 20,
    justifyContent: 'center',
  }
});
