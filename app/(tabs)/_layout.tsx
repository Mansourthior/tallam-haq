import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  // todo: if focused change icon with color icon
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === 'index') iconName = 'home';
          else if (route.name === 'quran') iconName = 'book';
          else if (route.name === 'books') iconName = 'library';
          else if (route.name === 'settings') iconName = 'settings';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#175601',
        tabBarInactiveTintColor: '#aabea7',
        headerShown: false,
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          title: "",
        }}
      />
      <Tabs.Screen
        name="books"
        options={{
          title: "",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: ""
        }}
      />
    </Tabs>
  );
}
