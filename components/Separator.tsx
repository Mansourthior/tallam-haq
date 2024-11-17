import React from 'react';
import { StyleSheet, View } from "react-native";
import { Colors } from "@/constants/Colors";

const Separator = () => {
  return <View style={styles.line} />;
};


const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: Colors.maron.tint
  },
});

export default Separator;
