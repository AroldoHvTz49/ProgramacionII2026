import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="registro" />
      <Stack.Screen name="estudiante/index" />
      <Stack.Screen name="estudiante/equipos" />
      <Stack.Screen name="estudiante/prestamos" />
      <Stack.Screen name="estudiante/perfil" />
      <Stack.Screen name="administrador/index" />
      <Stack.Screen name="administrador/equipos" />
      <Stack.Screen name="administrador/prestamos" />
      <Stack.Screen name="administrador/usuarios" />
      <Stack.Screen name="administrador/reportes" />
    </Stack>
  );
}