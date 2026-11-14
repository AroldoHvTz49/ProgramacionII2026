import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function MisPrestamos() {
  const [prestamos, setPrestamos] = useState<any[]>([]);

  useEffect(() => {
    cargarPrestamos();
  }, []);

  const cargarPrestamos = async () => {
    const { data: usuario } = await supabase.auth.getUser();

    if (!usuario.user) return;

    const { data } = await supabase
      .from('prestamos')
      .select('*, equipos(nombre, codigo)')
      .eq('estudiante_id', usuario.user.id)
      .order('created_at', { ascending: false });

    setPrestamos(data || []);
  };

  const colorEstado = (estado: string) => {
    switch (estado) {
      case 'aprobado': return '#16A34A';
      case 'rechazado': return '#DC2626';
      case 'devuelto': return '#2563EB';
      default: return '#D97706';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis préstamos</Text>

      <FlatList
        data={prestamos}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>No tienes préstamos registrados.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.equipos?.nombre}</Text>
            <Text>Código: {item.equipos?.codigo}</Text>
            <Text>Préstamo: {item.fecha_prestamo}</Text>
            <Text>Devolución: {item.fecha_devolucion}</Text>

            <Text style={[styles.status, { color: colorEstado(item.estado) }]}>
              Estado: {item.estado.toUpperCase()}
            </Text>
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
  title: { fontSize: 24, fontWeight: 'bold', color: '#17365D', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 18, borderRadius: 12, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#17365D', marginBottom: 8 },
  status: { fontWeight: 'bold', marginTop: 12 },
  back: { padding: 12, alignItems: 'center' },
});