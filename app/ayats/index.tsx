import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StatusBar
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchVerses } from "@/redux/actions";
import Header from "@/components/Header";
import {useLocalSearchParams} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import { router } from 'expo-router';

// @ts-ignore
const AyatScreen = ({}) => {
  // @ts-ignore
  const params = useLocalSearchParams<{
    sourateName: string;
    sourateNumber: number;
    query?: any }>();
  const sourateNumber : number = params.sourateNumber;
  const sourateName: string  = params.sourateName;
  const [fontSize, setFontSize] = useState(28);

  const dispatch = useDispatch();
  // @ts-ignore
  const verses = useSelector((state) => state.verses.verses);
  // @ts-ignore
  const loading = useSelector((state) => state.verses.loading);
  // @ts-ignore
  const error = useSelector((state) => state.verses.error);

  const increaseFontSize = () => setFontSize(prev => prev + 2);
  const decreaseFontSize = () => setFontSize(prev => prev - 2);

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchVerses(sourateNumber));
  }, [dispatch]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#71391f" />
      </View>
    );
  }

  if(error) {
    // TODO : faire un view pour le error
  }

  return (
      <SafeAreaView style={styles.container}>
        {/*<StatusBar barStyle="light-content" />*/}

        {/* Header */}
        <Header title={sourateName}
                subtitle={'Sourate ' + sourateNumber}
                showGoBack={true}
                onGoBackPress={router.back}/>

        {/* Contrôles de taille de police */}
        <View style={styles.fontControls}>
          <TouchableOpacity onPress={decreaseFontSize} style={styles.fontButton}>
            <Text style={styles.fontButtonText}>A-</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={increaseFontSize} style={styles.fontButton}>
            <Text style={styles.fontButtonText}>A+</Text>
          </TouchableOpacity>
        </View>

        {/* Contenu */}
        <ScrollView style={styles.content}>
          {verses.map((verse: any, index: number) => (
              <View key={verse.number} style={styles.verseContainer}>
                <View style={styles.verseHeader}>
                  <View style={styles.verseNumberContainer}>
                    <Text style={styles.verseNumber}>{index + 1}</Text>
                  </View>
                </View>
                <Text style={[styles.arabicText, { fontSize }]}>
                  {sourateNumber != 1 && index === 0 ? verse.text.substring(40) : verse.text}
                </Text>
              </View>
          ))}
        </ScrollView>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  surahName: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  surahNumber: {
    color: '#CBD5E0',
    fontSize: 14,
  },
  fontControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  fontButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: '#f8d4c4',
    borderRadius: 8,
  },
  fontButtonText: {
    color: '#71391f',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  verseContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  verseNumberContainer: {
    backgroundColor: '#f8d4c4',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseNumber: {
    color: '#71391f',
    fontSize: 14,
    fontWeight: 'bold',
  },
  arabicText: {
    textAlign: 'right',
    paddingTop: 16,
    marginBottom: 10,
    fontFamily: 'ScheherazadeNew',
    lineHeight: 50,
    color: '#111827',
  },
});

export default AyatScreen;
