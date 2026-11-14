import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function Equipos() {
  const [equipos, setEquipos] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [seleccionado, setSeleccionado] = useState<any>(null);
  const [fechaPrestamo, setFechaPrestamo] = useState('');
  const [fechaDevolucion, setFechaDevolucion] = useState('');

  useEffect(() => {
    cargarEquipos();
  }, []);

  const cargarEquipos = async () => {
    const { data, error } = await supabase
      .from('equipos')
      .select('*')
      .eq('estado', 'disponible')
      .gt('cantidad', 0)
      .order('nombre');

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    setEquipos(data || []);
  };

  const solicitarPrestamo = async () => {
    if (!fechaPrestamo || !fechaDevolucion) {
      Alert.alert('Atención', 'Ingrese las fechas del préstamo');
      return;
    }

    const fechaInicio = new Date(`${fechaPrestamo}T00:00:00`);
    const fechaFin = new Date(`${fechaDevolucion}T00:00:00`);

    if (
      Number.isNaN(fechaInicio.getTime()) ||
      Number.isNaN(fechaFin.getTime()) ||
      fechaFin < fechaInicio
    ) {
      Alert.alert('Error', 'Las fechas ingresadas no son válidas');
      return;
    }

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(fechaPrestamo) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(fechaDevolucion)
    ) {
      Alert.alert('Error', 'Utilice el formato AAAA-MM-DD');
      return;
    }

    const { data: usuario } = await supabase.auth.getUser();

    if (!usuario.user) {
      router.replace('/');
      return;
    }

    const { error } = await supabase.from('prestamos').insert({
      estudiante_id: usuario.user.id,
      equipo_id: seleccionado.id,
      fecha_prestamo: fechaPrestamo,
      fecha_devolucion: fechaDevolucion,
      estado: 'pendiente',
    });

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    Alert.alert('Solicitud enviada', 'Su solicitud está pendiente de aprobación');

    setSeleccionado(null);
    setFechaPrestamo('');
    setFechaDevolucion('');
  };

  const equiposFiltrados = equipos.filter((equipo) =>
    equipo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    equipo.codigo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Catálogo de equipos</Text>

      <TextInput
        style={styles.search}
        placeholder="Buscar equipo..."
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <FlatList
        data={equiposFiltrados}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>No hay equipos disponibles.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.nombre}</Text>
            <Text style={styles.description}>{item.descripcion}</Text>
            <Text style={styles.info}>Código: {item.codigo}</Text>
            <Text style={styles.info}>Categoría: {item.categoria}</Text>
            <Text style={styles.info}>Disponibles: {item.cantidad}</Text>

            <Pressable
              style={styles.button}
              onPress={() => setSeleccionado(item)}
            >
              <Text style={styles.buttonText}>Solicitar préstamo</Text>
            </Pressable>
          </View>
        )}
      />

      <Pressable style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>Volver</Text>
      </Pressable>

      <Modal visible={!!seleccionado} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              Solicitar equipo
            </Text>

            <Text style={styles.name}>{seleccionado?.nombre}</Text>

            <Text style={styles.label}>Fecha de préstamo (AAAA-MM-DD)</Text>
            <TextInput
              style={styles.input}
              placeholder="2026-11-15"
              value={fechaPrestamo}
              onChangeText={setFechaPrestamo}
            />

            <Text style={styles.label}>Fecha de devolución (AAAA-MM-DD)</Text>
            <TextInput
              style={styles.input}
              placeholder="2026-11-17"
              value={fechaDevolucion}
              onChangeText={setFechaDevolucion}
            />

            <Pressable style={styles.button} onPress={solicitarPrestamo}>
              <Text style={styles.buttonText}>Enviar solicitud</Text>
            </Pressable>

            <Pressable onPress={() => setSeleccionado(null)}>
              <Text style={styles.cancel}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#F1F5F9' },
  title: { fontSize: 23, fontWeight: 'bold', color: '#17365D', marginBottom: 18 },
  search: {
    backgroundColor: '#fff',
    padding: 13,
    borderRadius: 8,
    marginBottom: 15,
  },
  card: { backgroundColor: '#fff', padding: 18, borderRadius: 12, marginBottom: 15 },
  icon: { fontSize: 30 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#17365D', marginVertical: 8 },
  description: { color: '#64748B', marginBottom: 8 },
  info: { color: '#475569', marginBottom: 4 },
  button: { backgroundColor: '#17365D', padding: 13, borderRadius: 8, marginTop: 12 },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  back: { padding: 12, alignItems: 'center' },
  backText: { color: '#2563EB', fontWeight: 'bold' },
  modalBackground: {
    flex: 1,
    backgroundColor: '#0008',
    justifyContent: 'center',
    padding: 20,
  },
  modal: { backgroundColor: '#fff', borderRadius: 15, padding: 22 },
  modalTitle: { fontSize: 21, fontWeight: 'bold', color: '#17365D' },
  label: { marginTop: 12, marginBottom: 5, color: '#334155' },
  input: { borderWidth: 1, borderColor: '#CBD5E1', padding: 12, borderRadius: 8 },
  cancel: { textAlign: 'center', color: '#DC2626', marginTop: 18 },
});