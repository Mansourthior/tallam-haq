import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onGoBackPress?: () => void;
  onSettingsPress?: () => void;
  showGoBack?: boolean;
  showSettings?: boolean;
  backgroundColor?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onGoBackPress,
  onSettingsPress,
  showGoBack = false,
  showSettings = true,
  backgroundColor = "#fff",
}) => {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View style={styles.header}>
        {showGoBack ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onGoBackPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="arrow-back-circle-outline"
              size={24}
              color="maroon"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.iconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          ></TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {showSettings && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onSettingsPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="settings-outline" size={24} color="maroon" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    width: "100%",
    // ...Platform.select({
    //   android: {
    //     paddingTop: Platform.Version >= 23 ? 24 : 0,
    //   },
    // }),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 16,
  },
  title: {
    color: "#551c01",
    fontSize: 24,
    fontFamily: "ScheherazadeNew",
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: "#b55e34",
    fontSize: 14,
    textAlign: "center",
    marginTop: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Header;
