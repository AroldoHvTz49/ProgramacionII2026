
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function Perfil() {
  const [perfil, setPerfil] = useState<any>(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    const { data: usuario } = await supabase.auth.getUser();

    if (!usuario.user) return;

    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', usuario.user.id)
      .single();

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    setPerfil(data);
  };

  const seleccionarFoto = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      guardarFoto(resultado.assets[0].uri);
    }
  };

  const guardarFoto = async (uri: string) => {
    try {
      setCargando(true);

      const { data: usuario } = await supabase.auth.getUser();

      if (!usuario.user) {
        throw new Error('Debe iniciar sesión nuevamente');
      }

      const extension = uri.split('.').pop()?.split('?')[0] || 'jpg';
      const nombreArchivo = `${usuario.user.id}/perfil.${extension}`;

      const respuesta = await fetch(uri);
      const archivo = await respuesta.arrayBuffer();

      const { error: errorFoto } = await supabase.storage
        .from('fotografias')
        .upload(nombreArchivo, archivo, {
          upsert: true,
          contentType: `image/${extension === 'jpg' ? 'jpeg' : extension}`,
        });

      if (errorFoto) throw errorFoto;

      const { data: imagen } = supabase.storage
        .from('fotografias')
        .getPublicUrl(nombreArchivo);

      const { error: errorPerfil } = await supabase
        .from('perfiles')
        .update({ foto: imagen.publicUrl })
        .eq('id', usuario.user.id);

      if (errorPerfil) throw errorPerfil;

      setPerfil((actual: any) => ({
        ...actual,
        foto: imagen.publicUrl,
      }));

      Alert.alert('Correcto', 'Fotografía actualizada correctamente');

    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo guardar la fotografía');
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi perfil</Text>

      <Pressable onPress={seleccionarFoto} disabled={cargando}>
        {perfil?.foto ? (
          <Image source={{ uri: perfil.foto }} style={styles.photo} />
        ) : (
          <View style={styles.placeholder}>
            <Text>No hay foto</Text>
          </View>
        )}
      </Pressable>

      <Pressable
        style={styles.photoButton}
        onPress={seleccionarFoto}
        disabled={cargando}
      >
        <Text style={styles.photoButtonText}>
          {cargando ? 'Guardando fotografía...' : 'Cambiar fotografía'}
        </Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre completo</Text>
        <Text style={styles.value}>{perfil?.nombre}</Text>

        <Text style={styles.label}>Carné universitario</Text>
        <Text style={styles.value}>{perfil?.carne}</Text>

        <Text style={styles.label}>Carrera</Text>
        <Text style={styles.value}>{perfil?.carrera}</Text>

        <Text style={styles.label}>Tipo de usuario</Text>
        <Text style={styles.value}>{perfil?.rol}</Text>
      </View>

      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Volver</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    padding: 25,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#17365D',
    marginBottom: 25,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#DBEAFE',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoButton: {
    backgroundColor: '#DBEAFE',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 12,
  },
  photoButtonText: {
    color: '#17365D',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginTop: 25,
  },
  label: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 12,
  },
  value: {
    color: '#17365D',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#17365D',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
