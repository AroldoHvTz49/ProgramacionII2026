import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function Administrador() {
  const [estudiantes, setEstudiantes] = useState(0);
  const [equipos, setEquipos] = useState(0);
  const [pendientes, setPendientes] = useState(0);
  const [activos, setActivos] = useState(0);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const consultas = await Promise.all([
      supabase.from('perfiles').select('*', { count: 'exact', head: true })
        .eq('rol', 'estudiante'),
      supabase.from('equipos').select('*', { count: 'exact', head: true }),
      supabase.from('prestamos').select('*', { count: 'exact', head: true })
        .eq('estado', 'pendiente'),
      supabase.from('prestamos').select('*', { count: 'exact', head: true })
        .eq('estado', 'aprobado'),
    ]);

    setEstudiantes(consultas[0].count || 0);
    setEquipos(consultas[1].count || 0);
    setPendientes(consultas[2].count || 0);
    setActivos(consultas[3].count || 0);
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  const opciones = [
    { titulo: 'Gestionar equipos', ruta: '/administrador/equipos' },
    { titulo: 'Gestionar préstamos', ruta: '/administrador/prestamos' },
    { titulo: 'Estudiantes registrados', ruta: '/administrador/usuarios' },
    { titulo: 'Reportes y estadísticas', ruta: '/administrador/reportes' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Panel administrativo</Text>
          <Text style={styles.subtitle}>Gestión de laboratorios</Text>
        </View>
        <Pressable onPress={cerrarSesion}>
          <Text style={styles.logout}>Salir</Text>
        </Pressable>
      </View>

      <Text style={styles.section}>Resumen general</Text>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.number}>{estudiantes}</Text>
          <Text>Estudiantes</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.number}>{equipos}</Text>
          <Text>Equipos</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.number}>{pendientes}</Text>
          <Text>Pendientes</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.number}>{activos}</Text>
          <Text>Activos</Text>
        </View>
      </View>

      <Text style={styles.section}>Administración</Text>

      {opciones.map((opcion) => (
        <Pressable
          key={opcion.ruta}
          style={styles.option}
          onPress={() => router.push(opcion.ruta as any)}
        >
          <Text style={styles.optionText}>{opcion.titulo}</Text>
          <Text style={styles.arrow}></Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9', padding: 20 },
  header: {
    marginTop: 35,
    marginBottom: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 23, fontWeight: 'bold', color: '#17365D' },
  subtitle: { color: '#64748B', marginTop: 5 },
  logout: { color: '#DC2626', fontWeight: 'bold' },
  section: { fontSize: 19, fontWeight: 'bold', color: '#17365D', marginBottom: 15 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 },
  stat: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  number: { fontSize: 30, fontWeight: 'bold', color: '#2563EB' },
  option: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: { fontSize: 25, marginRight: 15 },
  optionText: { flex: 1, fontWeight: 'bold', color: '#17365D' },
  arrow: { fontSize: 25, color: '#64748B' },
});