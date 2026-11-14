import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function Estudiante() {
  const [perfil, setPerfil] = useState<any>(null);
  const [pendientes, setPendientes] = useState(0);
  const [activos, setActivos] = useState(0);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const { data: usuario } = await supabase.auth.getUser();

    if (!usuario.user) {
      router.replace('/');
      return;
    }

    const { data } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', usuario.user.id)
      .single();

    setPerfil(data);

    const { count: p } = await supabase
      .from('prestamos')
      .select('*', { count: 'exact', head: true })
      .eq('estudiante_id', usuario.user.id)
      .eq('estado', 'pendiente');

    const { count: a } = await supabase
      .from('prestamos')
      .select('*', { count: 'exact', head: true })
      .eq('estudiante_id', usuario.user.id)
      .eq('estado', 'aprobado');

    setPendientes(p || 0);
    setActivos(a || 0);
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Panel de estudiante</Text>
          <Text style={styles.headerSubtitle}>Gestión de laboratorios</Text>
        </View>
        <Pressable onPress={cerrarSesion}>
          <Text style={styles.logout}>Salir</Text>
        </Pressable>
      </View>

      <View style={styles.profile}>
        {perfil?.foto ? (
          <Image source={{ uri: perfil.foto }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={{ fontSize: 25 }}>No hay foto</Text>
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{perfil?.nombre || 'Estudiante'}</Text>
          <Text style={styles.info}>Carné: {perfil?.carne}</Text>
          <Text style={styles.info}>{perfil?.carrera}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Resumen de préstamos</Text>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.number}>{pendientes}</Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.number}>{activos}</Text>
          <Text style={styles.statLabel}>Activos</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Opciones</Text>

      <Pressable
        style={styles.option}
        onPress={() => router.push('/estudiante/equipos')}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.optionTitle}>Catálogo de equipos</Text>
          <Text style={styles.optionDescription}>Consultar y solicitar equipos</Text>
        </View>
        <Text style={styles.arrow}></Text>
      </Pressable>

      <Pressable
        style={styles.option}
        onPress={() => router.push('/estudiante/prestamos')}
      >

        <View style={{ flex: 1 }}>
          <Text style={styles.optionTitle}>Mis préstamos</Text>
          <Text style={styles.optionDescription}>Consultar estados e historial</Text>
        </View>
        <Text style={styles.arrow}></Text>
      </Pressable>

      <Pressable
        style={styles.option}
        onPress={() => router.push('/estudiante/perfil')}
      >

        <View style={{ flex: 1 }}>
          <Text style={styles.optionTitle}>Mi perfil</Text>
          <Text style={styles.optionDescription}>Consultar mis datos</Text>
        </View>
        <Text style={styles.arrow}></Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9', padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 35,
    marginBottom: 25,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#17365D' },
  headerSubtitle: { color: '#64748B', marginTop: 4 },
  logout: { color: '#DC2626', fontWeight: 'bold' },
  profile: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  photo: { width: 65, height: 65, borderRadius: 35 },
  photoPlaceholder: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: { fontSize: 17, fontWeight: 'bold', color: '#17365D' },
  info: { color: '#64748B', marginTop: 4 },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#17365D',
    marginTop: 25,
    marginBottom: 12,
  },
  stats: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  number: { fontSize: 30, fontWeight: 'bold', color: '#2563EB' },
  statLabel: { color: '#64748B', marginTop: 5 },
  option: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionIcon: { fontSize: 25 },
  optionTitle: { fontWeight: 'bold', color: '#17365D', fontSize: 15 },
  optionDescription: { color: '#64748B', fontSize: 12, marginTop: 4 },
  arrow: { fontSize: 25, color: '#64748B' },
});