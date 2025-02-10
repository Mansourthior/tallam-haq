/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorGreen = "#34633b";
const tintColorMaron = "maroon";
const tintColorDark = "#fff";

export const Colors = {
  maron: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorMaron,
    icon: "#11181C",
    tabIconDefault: "#11181C",
    tabIconSelected: tintColorMaron,
  },
  green: {
    text: "#34633b",
    background: "#fff",
    tint: tintColorGreen,
    icon: "#34633b",
    tabIconDefault: "#579e63",
    tabIconSelected: tintColorGreen,
  },
  white: {
    text: "#fff",
    background: "#fff",
    tint: tintColorDark,
    icon: "#fff",
    tabIconDefault: "#fff",
    tabIconSelected: tintColorDark,
  },
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};
