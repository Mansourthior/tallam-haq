import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchSourates } from "@/redux/actions";
import Header from "@/components/Header";
import {useRouter} from "expo-router";

// @ts-ignore
const SourateScreen = () => {
  const router = useRouter();
  const img = require('../../assets/images/frame.png');
  const dispatch = useDispatch();

  // @ts-ignore
  const sourates = useSelector((state) => state.sourates.sourates);
  // @ts-ignore
  const loading = useSelector((state) => state.sourates.loading);
  // @ts-ignore
  const error = useSelector((state) => state.sourates.error);

  const navigate = (name: string, id: number) => {
    const route = 'ayats';
    // @ts-ignore
    router.push({ pathname: route, params: { sourateName: name, sourateNumber: id }});
  };

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchSourates());
  }, [dispatch]);

  // @ts-ignore
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigate(item.name, item.number)} >
      <View style={styles.iconContainer}>
        <Image source={img} style={styles.imageParams} />
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>{item.number}</Text>
        </View>
      </View>
      <View>
        <Text style={styles.title}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

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
    <View style={styles.container}>
      <Header title={'القرآن الكريم'}/>
      <FlatList
        data={sourates}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        keyExtractor={item => item.number.toString()}
        showsVerticalScrollIndicator={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  imageParams: {
    width: 45,
    height: 45,
  },
  list: {
    padding: 20,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  item: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 5,
    marginVertical: 5,
    borderRadius: 15,
    borderRightWidth: 3,
    borderBottomWidth: 1,
    borderLeftColor: '#34633b',
    backgroundColor: '#ed8f68',
  },
  iconContainer: {
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    position: 'relative',
    alignItems: 'center',
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    color: '#000',
    marginRight: 15,
    fontFamily: 'ScheherazadeNew'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    marginTop: 15,
  },
  counterText: {
    fontSize: 8,
    padding: 6,
    fontWeight: "bold",
    borderRadius: 5,
  },
});

export default SourateScreen;
