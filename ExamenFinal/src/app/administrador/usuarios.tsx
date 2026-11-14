import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .eq('rol', 'estudiante')
      .order('nombre');

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    setUsuarios(data || []);
  };

  const filtrados = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (usuario.carne || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estudiantes registrados</Text>

      <TextInput
        style={styles.search}
        placeholder="Buscar por nombre o carné"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No hay estudiantes registrados.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.foto ? (
              <Image source={{ uri: item.foto }} style={styles.photo} />
            ) : (
              <View style={styles.placeholder}>
                <Text>No hay foto</Text>
              </View>
            )}

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.nombre}</Text>
              <Text>Carné: {item.carne}</Text>
              <Text>Carrera: {item.carrera}</Text>
            </View>
          </View>
        )}
      />

      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={{ color: '#2563EB' }}>Volver</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#F1F5F9' },
  title: { fontSize: 23, fontWeight: 'bold', color: '#17365D', marginBottom: 18 },
  search: { backgroundColor: '#fff', padding: 13, borderRadius: 8, marginBottom: 15 },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  photo: { width: 60, height: 60, borderRadius: 30 },
  placeholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: { fontSize: 16, fontWeight: 'bold', color: '#17365D', marginBottom: 5 },
  back: { padding: 12, alignItems: 'center' },
});