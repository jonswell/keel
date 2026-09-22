import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { fonts } from '@/theme';

const ICONS = {
  index: { on: 'people-circle', off: 'people-circle-outline' },
  access: { on: 'list', off: 'list-outline' },
  home: { on: 'home', off: 'home-outline' },
  finance: { on: 'wallet', off: 'wallet-outline' },
} as const;

export default function TabLayout() {
  const { colors } = useResolvedTheme();
  const insets = useSafeAreaInsets();
  const tabPad = Math.max(insets.bottom, 10);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarHideOnKeyboard: true,
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.line,
          paddingTop: 6,
          paddingBottom: tabPad,
          height: 52 + tabPad,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.body,
          fontSize: 11,
          lineHeight: 14,
          letterSpacing: 0.4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Circles',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? ICONS.index.on : ICONS.index.off} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="access"
        options={{
          title: 'Access',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? ICONS.access.on : ICONS.access.off} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? ICONS.home.on : ICONS.home.off} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="finance"
        options={{
          title: 'Finance',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? ICONS.finance.on : ICONS.finance.off} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
