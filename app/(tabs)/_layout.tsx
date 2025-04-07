import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName="MainMenuScreen"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="MainMenuScreen"
        options={{
          title: 'Main Menu',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Closet"
        options={{
          title: 'My Closet',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="tshirt.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="MatchingPage"
        options={{
          title: 'Matching Page',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="wand.and.stars" color={color} />,
        }}
      />
    </Tabs>
  );
}
