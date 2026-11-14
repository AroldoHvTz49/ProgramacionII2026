import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function HomeScreen() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = async () => {
    if (!correo || !password) {
      Alert.alert('Atención', 'Complete todos los campos');
      return;
    }

    setCargando(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: correo.trim(),
      password,
    });

    if (error) {
      Alert.alert('Error', error.message);
      setCargando(false);
      return;
    }

    const { data: perfil, error: errorPerfil } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    setCargando(false);

    if (errorPerfil) {
      Alert.alert('Error', 'No se encontró el perfil');
      await supabase.auth.signOut();
      return;
    }

    if (perfil.rol === 'estudiante') {
      router.replace('/estudiante');
    } else {
      router.replace('/administrador');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GESTIÓN DE LABORATORIOS</Text>
      <Text style={styles.subtitle}>
        Sistema universitario de préstamo de equipos
      </Text>

      <View style={styles.form}>
        <Text style={styles.heading}>Iniciar sesión</Text>

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="correo@universidad.edu"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable style={styles.button} onPress={iniciarSesion}>
          {cargando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>INGRESAR</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.push('/registro')}>
          <Text style={styles.link}>Crear cuenta de estudiante</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: { fontSize: 55, marginBottom: 15 },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#17365D',
    textAlign: 'center',
  },
  subtitle: { color: '#64748B', marginTop: 8, marginBottom: 30 },
  form: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    gap: 12,
  },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#17365D' },
  label: { fontWeight: '600', color: '#334155' },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 13,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#17365D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#2563EB', textAlign: 'center', marginTop: 12 },
});