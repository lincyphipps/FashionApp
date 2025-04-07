import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react';
import { Stack, useRouter, Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig'; 

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/(tabs)/MainMenuScreen'); // go to main tab if logged in
      } else {
        router.replace('/Login'); // go to login if not logged in
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loaded && authChecked) {
      SplashScreen.hideAsync();
    }
  }, [loaded, authChecked]);

  if (!loaded || !authChecked) {
   console.log("isLoading...");
  }  

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="CreateAccount"
            options={{ 
              title: 'Back to Sign in',
              headerShown: true,
              headerStyle: { backgroundColor: '#A078B6' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
              headerBackTitle: 'back',
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SafeAreaProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
