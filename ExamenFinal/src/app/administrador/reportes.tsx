import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function Reportes() {
  const [reportes, setReportes] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [activos, setActivos] = useState(0);
  const [devueltos, setDevueltos] = useState(0);
  const [rechazados, setRechazados] = useState(0);

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    const { data, error } = await supabase
      .from('prestamos')
      .select('estado, equipo_id, equipos(nombre, codigo)');

    if (error) return;

    const lista = data || [];

    setTotal(lista.length);
    setActivos(lista.filter((p) => p.estado === 'aprobado').length);
    setDevueltos(lista.filter((p) => p.estado === 'devuelto').length);
    setRechazados(lista.filter((p) => p.estado === 'rechazado').length);

    const agrupados: any = {};

    lista.forEach((prestamo: any) => {
      const id = prestamo.equipo_id;

      if (!agrupados[id]) {
        agrupados[id] = {
          id,
          nombre: prestamo.equipos?.nombre || 'Equipo',
          codigo: prestamo.equipos?.codigo || '',
          cantidad: 0,
        };
      }

      agrupados[id].cantidad++;
    });

    const ordenados = Object.values(agrupados).sort(
      (a: any, b: any) => b.cantidad - a.cantidad
    );

    setReportes(ordenados);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reportes y estadísticas</Text>

      <View style={styles.summary}>
        <View style={styles.box}>
          <Text style={styles.number}>{total}</Text>
          <Text>Total de solicitudes</Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.number}>{activos}</Text>
          <Text>Préstamos activos</Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.number}>{devueltos}</Text>
          <Text>Equipos devueltos</Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.number}>{rechazados}</Text>
          <Text>Solicitudes rechazadas</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>Equipos más solicitados</Text>

      <FlatList
        data={reportes}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>No hay datos para generar reportes.</Text>}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <View style={styles.position}>
              <Text style={styles.positionText}>{index + 1}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.nombre}</Text>
              <Text style={styles.code}>Código: {item.codigo}</Text>
            </View>

            <Text style={styles.quantity}>{item.cantidad} solicitudes</Text>
          </View>
        )}
      />

      <Pressable onPress={cargarReportes} style={styles.refresh}>
        <Text style={styles.buttonText}>Actualizar reporte</Text>
      </Pressable>

      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={{ color: '#2563EB' }}>Volver</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#F1F5F9' },
  title: { fontSize: 23, fontWeight: 'bold', color: '#17365D', marginBottom: 20 },
  summary: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  box: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  number: { fontSize: 27, fontWeight: 'bold', color: '#2563EB' },
  subtitle: { fontSize: 19, fontWeight: 'bold', color: '#17365D', marginVertical: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  position: {
    backgroundColor: '#DBEAFE',
    width: 35,
    height: 35,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  positionText: { color: '#17365D', fontWeight: 'bold' },
  name: { fontWeight: 'bold', color: '#17365D' },
  code: { color: '#64748B', marginTop: 4 },
  quantity: { color: '#2563EB', fontWeight: 'bold', fontSize: 12 },
  refresh: { backgroundColor: '#17365D', padding: 13, borderRadius: 8, marginTop: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  back: { padding: 12, alignItems: 'center' },
});