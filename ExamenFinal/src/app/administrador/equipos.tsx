import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function GestionEquipos() {
  const [equipos, setEquipos] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [id, setId] = useState<number | null>(null);
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('1');

  useEffect(() => {
    cargarEquipos();
  }, []);

  const cargarEquipos = async () => {
    const { data, error } = await supabase
      .from('equipos')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    setEquipos(data || []);
  };

  const limpiar = () => {
    setId(null);
    setNombre('');
    setCodigo('');
    setCategoria('');
    setDescripcion('');
    setCantidad('1');
  };

  const nuevoEquipo = () => {
    limpiar();
    setModal(true);
  };

  const editarEquipo = (equipo: any) => {
    setId(equipo.id);
    setNombre(equipo.nombre);
    setCodigo(equipo.codigo);
    setCategoria(equipo.categoria || '');
    setDescripcion(equipo.descripcion || '');
    setCantidad(String(equipo.cantidad));
    setModal(true);
  };

  const guardarEquipo = async () => {
    if (!nombre || !codigo || !cantidad) {
      Alert.alert('Atención', 'Complete los campos obligatorios');
      return;
    }

    const numero = Number(cantidad);

    if (!Number.isInteger(numero) || numero < 0) {
      Alert.alert('Error', 'La cantidad debe ser un entero positivo o cero');
      return;
    }

    const datos = {
      nombre,
      codigo,
      categoria,
      descripcion,
      cantidad: numero,
    };

    const respuesta = id
      ? await supabase.from('equipos').update(datos).eq('id', id)
      : await supabase.from('equipos').insert(datos);

    if (respuesta.error) {
      Alert.alert('Error', respuesta.error.message);
      return;
    }

    setModal(false);
    limpiar();
    cargarEquipos();
    Alert.alert('Correcto', 'Equipo guardado');
  };

  const eliminarEquipo = (equipo: any) => {
    Alert.alert(
      'Eliminar equipo',
      `¿Desea eliminar ${equipo.nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('equipos')
              .delete()
              .eq('id', equipo.id);

            if (error) {
              Alert.alert('Error', error.message);
              return;
            }

            cargarEquipos();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventario de equipos</Text>

      <Pressable style={styles.add} onPress={nuevoEquipo}>
        <Text style={styles.buttonText}>+ Agregar equipo</Text>
      </Pressable>

      <FlatList
        data={equipos}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>No hay equipos registrados.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.nombre}</Text>
            <Text>Código: {item.codigo}</Text>
            <Text>Categoría: {item.categoria}</Text>
            <Text>Cantidad: {item.cantidad}</Text>
            <Text>Estado: {item.estado}</Text>

            <View style={styles.actions}>
              <Pressable onPress={() => editarEquipo(item)} style={styles.edit}>
                <Text style={styles.buttonText}>Editar</Text>
              </Pressable>

              <Pressable onPress={() => eliminarEquipo(item)} style={styles.delete}>
                <Text style={styles.buttonText}>Eliminar</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={{ color: '#2563EB' }}>Volver</Text>
      </Pressable>

      <Modal visible={modal} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              {id ? 'Editar equipo' : 'Nuevo equipo'}
            </Text>

            <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
            <TextInput style={styles.input} placeholder="Código" value={codigo} onChangeText={setCodigo} />
            <TextInput style={styles.input} placeholder="Categoría" value={categoria} onChangeText={setCategoria} />
            <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} />
            <TextInput style={styles.input} placeholder="Cantidad" value={cantidad} onChangeText={setCantidad} keyboardType="numeric" />

            <Pressable style={styles.add} onPress={guardarEquipo}>
              <Text style={styles.buttonText}>Guardar</Text>
            </Pressable>

            <Pressable onPress={() => setModal(false)}>
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
  title: { fontSize: 23, fontWeight: 'bold', color: '#17365D', marginBottom: 15 },
  add: { backgroundColor: '#17365D', padding: 13, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#17365D', marginBottom: 8 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  edit: { flex: 1, backgroundColor: '#2563EB', padding: 10, borderRadius: 7, alignItems: 'center' },
  delete: { flex: 1, backgroundColor: '#DC2626', padding: 10, borderRadius: 7, alignItems: 'center' },
  back: { padding: 12, alignItems: 'center' },
  modalBackground: { flex: 1, backgroundColor: '#0008', justifyContent: 'center', padding: 20 },
  modal: { backgroundColor: '#fff', padding: 20, borderRadius: 15 },
  modalTitle: { fontSize: 21, fontWeight: 'bold', color: '#17365D', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', padding: 11, borderRadius: 8, marginBottom: 10 },
  cancel: { color: '#DC2626', textAlign: 'center', marginTop: 15 },
});