import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Alert, Pressable, Text, useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { authRepo } from '.';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const cerrarSesion = async ()=>{
    try {
      await authRepo.cerrarSesion()
      router.replace("/login")
    }
    catch(error){
      Alert.alert(
            'No se pudo cerrar sesión',
            error instanceof Error ? error.message : 'Intenta de nuevo.',
          );
    }
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
   
      <Stack screenOptions={{
        headerRight: () => (
          <Pressable onPress={()=> cerrarSesion()} accessibilityRole="button">
            <Text>Cerrar sesión</Text>
          </Pressable>
        ),
      }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="products" />
        <Stack.Screen name="explore" />
      </Stack>
    </ThemeProvider>
  );
}
