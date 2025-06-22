import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { useColorScheme } from 'react-native';
import { theme } from '../theme';
import { AuthProvider } from '../contexts/AuthContext';
import { AIProvider } from '../contexts/AIContext';
import { NotificationProvider } from '../contexts/NotificationContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = React.useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts
        await Font.loadAsync({
          'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
          'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
          'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
          'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
          'Noto-Sans-Devanagari': require('../assets/fonts/NotoSansDevanagari-Regular.ttf'),
          'Noto-Nastaliq-Urdu': require('../assets/fonts/NotoNastaliqUrdu-Regular.ttf'),
        });

        // Pre-load other resources
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <AIProvider>
            <NotificationProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: 'slide_from_right',
                }}
              >
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="auth" />
                <Stack.Screen name="ai-counselor" />
                <Stack.Screen name="document-advisor" />
                <Stack.Screen name="safety-analysis" />
                <Stack.Screen name="neet-counseling" />
                <Stack.Screen name="jee-counseling" />
                <Stack.Screen name="settings" />
              </Stack>
              <StatusBar style="auto" />
            </NotificationProvider>
          </AIProvider>
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
} 