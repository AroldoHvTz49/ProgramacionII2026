import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { supabase } from '@/database/supabase';
import { useTheme } from '@/hooks/use-theme';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Tarea = {
  id: number;
  nombre: string;
  fecha: string;
  responsable: string;
};

export default function verTareasScreen() {
  const theme = useTheme();

  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado del formulario que aparece en el Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [tareaEditando, setTareaEditando] = useState<Tarea | null>(null);
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [responsable, setResponsable] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cargarTareas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('tareas').select('*').order('id');

      if (error) {
        Alert.alert('Ha ocurrido un error', error.message);
        return;
      }

      // Supabase devuelve las filas sin tipos, así que las casteamos.
      setTareas((data ?? []) as Tarea[]);
    } catch (err) {
      Alert.alert('Ha ocurrido un error', err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  const abrirNuevo = () => {
    setTareaEditando(null);
    setNombre('');
    setFecha('');
    setResponsable('');
    setModalVisible(true);
  };

  const abrirEdicion = (tarea: Tarea) => {
    setTareaEditando(tarea);
    setNombre(tarea.nombre);
    setFecha(tarea.fecha);
    setResponsable(tarea.responsable);
    setModalVisible(true);
  };

  const guardarTarea = async () => {
    if (!nombre.trim() || !fecha.trim() || !responsable.trim()) {
      Alert.alert('Datos incompletos', 'El nombre, fecha y responsable son obligatorios.');
      return;
    }

    setGuardando(true);
    try {
      const datos = {
        nombre: nombre.trim(),
        fecha: fecha.trim(),
        responsable: responsable.trim(),
      };

      // Si hay un producto en edición hacemos UPDATE, si no, INSERT.
      const resultado = tareaEditando
        ? await supabase.from('tareas').update(datos).eq('id', tareaEditando.id)
        : await supabase.from('tareas').insert(datos)

      if (resultado.error) {
        Alert.alert('Ha ocurrido un error', resultado.error.message);
        return;
      }

      setModalVisible(false);
      cargarTareas();
    } catch (err) {
      Alert.alert('Ha ocurrido un error', err instanceof Error ? err.message : String(err));
    } finally {
      setGuardando(false);
    }
  };



  const renderItem = ({ item }: { item: Tarea }) => (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedView type="backgroundElement" style={styles.cardInfo}>
        <ThemedText type="smallBold">{item.nombre}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Responsable: {item.responsable}
        </ThemedText>
        <ThemedText type="smallBold">Fecha {item.fecha}</ThemedText>
      </ThemedView>

      <ThemedView type="backgroundElement" style={styles.cardActions}>
        <Pressable style={({ pressed }) => pressed && styles.pressed} onPress={() => abrirEdicion(item)}>
          <ThemedView type="backgroundSelected" style={styles.editButton}>
            <ThemedText type="small" style={styles.editButtonText}>
              Editar
            </ThemedText>
          </ThemedView>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );

  return (

    

    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle">Tareas</ThemedText>
          <Pressable style={({ pressed }) => pressed && styles.pressed} onPress={abrirNuevo}>
            <ThemedView type="backgroundSelected" style={styles.newProductButton}>
              <ThemedText type="small" style={styles.editButtonText}>
                + Nueva Tarea
              </ThemedText>
            </ThemedView>
          </Pressable>
        </ThemedView>

        

        {loading ? (
          <ThemedText type="small" themeColor="textSecondary" style={styles.emptyText}>
            Cargando Tareas…
          </ThemedText>
        ) : tareas.length === 0 ? (
          <ThemedText type="small" themeColor="textSecondary" style={styles.emptyText}>
            No hay tareas registradas.
          </ThemedText>
        ) : (
          <FlatList
            data={tareas}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        )}
      </SafeAreaView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <ThemedView type="backgroundElement" style={styles.modalCard}>
            <ThemedText type="subtitle">
              {tareaEditando ? 'Editar tarea' : 'Nueva tarea'}
            </ThemedText>

            <ThemedView type="backgroundElement" style={styles.field}>
              <ThemedText type="smallBold">Nombre</ThemedText>
              <TextInput
                style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Ej. Tarea Progra II"
                placeholderTextColor={theme.textSecondary}
              />
            </ThemedView>

            <ThemedView type="backgroundElement" style={styles.field}>
              <ThemedText type="smallBold">Fecha</ThemedText>
              <TextInput
                style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
                value={fecha}
                onChangeText={setFecha}
                placeholder="28 de Septiembre"
                placeholderTextColor={theme.textSecondary}
              />
            </ThemedView>

            <ThemedView type="backgroundElement" style={styles.field}>
              <ThemedText type="smallBold">Responsable</ThemedText>
              <TextInput
                style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
                value={responsable}
                onChangeText={setResponsable}
                placeholder="Fernando"
                placeholderTextColor={theme.textSecondary}
              />
            </ThemedView>

            <Pressable disabled={guardando} style={({ pressed }) => pressed && styles.pressed} onPress={guardarTarea}>
              <ThemedView type="backgroundSelected" style={styles.saveButton}>
                <ThemedText type="small" style={styles.saveButtonText}>
                  {guardando ? 'Guardando…' : 'Guardar Tarea'}
                </ThemedText>
              </ThemedView>
            </Pressable>

            <Pressable style={({ pressed }) => pressed && styles.pressed} onPress={() => setModalVisible(false)}>
              <ThemedView style={styles.cancelButton}>
                <ThemedText type="small" themeColor="textSecondary">
                  Cancelar
                </ThemedText>
              </ThemedView>
            </Pressable>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.four,
    alignSelf: 'stretch',
  },
  newProductButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: Spacing.five,
  },
  listContent: {
    alignSelf: 'stretch',
    gap: Spacing.three,
    paddingBottom: Spacing.four,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  cardInfo: {
    flex: 1,
    gap: Spacing.half,
  },
  cardActions: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'center',
  },
  editButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  editButtonText: {
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: Spacing.four,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    alignSelf: 'stretch',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Spacing.four,
  },
  field: {
    gap: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  saveButtonText: {
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
});
