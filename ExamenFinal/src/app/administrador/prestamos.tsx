
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function GestionPrestamos() {
  const [prestamos, setPrestamos] = useState<any[]>([]);
  const [filtro, setFiltro] = useState('todos');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarPrestamos();
  }, [filtro]);

  const cargarPrestamos = async () => {
    setCargando(true);

    let consulta = supabase
      .from('prestamos')
      .select(`
        *,
        equipos(nombre, codigo),
        perfiles(nombre, carne, carrera)
      `)
      .order('created_at', { ascending: false });

    if (filtro !== 'todos') {
      consulta = consulta.eq('estado', filtro);
    }

    const { data, error } = await consulta;

    if (error) {
      console.error('ERROR AL CARGAR:', error.message);

      if (Platform.OS === 'web') {
        window.alert('Error: ' + error.message);
      } else {
        Alert.alert('Error', error.message);
      }

      setCargando(false);
      return;
    }

    setPrestamos(data || []);
    setCargando(false);
  };

  const cambiarEstado = async (id: number, estado: string) => {
    const mensaje = `¿Desea cambiar el estado del préstamo a ${estado}?`;

    if (Platform.OS === 'web') {
      const confirmar = window.confirm(mensaje);

      if (!confirmar) return;

      await actualizarEstado(id, estado);
    } else {
      Alert.alert(
        'Confirmar acción',
        mensaje,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Confirmar',
            onPress: () => actualizarEstado(id, estado),
          },
        ]
      );
    }
  };

  const actualizarEstado = async (id: number, estado: string) => {
    const { error } = await supabase
      .from('prestamos')
      .update({ estado })
      .eq('id', id);

    if (error) {
      console.error('ERROR AL ACTUALIZAR:', error.message);

      if (Platform.OS === 'web') {
        window.alert('Error al actualizar: ' + error.message);
      } else {
        Alert.alert('Error', error.message);
      }

      return;
    }

    if (Platform.OS === 'web') {
      window.alert('El préstamo fue actualizado correctamente.');
    } else {
      Alert.alert('Éxito', 'El préstamo fue actualizado correctamente.');
    }

    await cargarPrestamos();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de préstamos</Text>

      <View style={styles.filters}>
        {['todos', 'pendiente', 'aprobado', 'rechazado', 'devuelto'].map((estado) => (
          <Pressable
            key={estado}
            onPress={() => setFiltro(estado)}
            style={[
              styles.filter,
              filtro === estado && styles.selected,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filtro === estado && styles.selectedText,
              ]}
            >
              {estado.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      {cargando && (
        <Text style={styles.loading}>Cargando préstamos...</Text>
      )}

      <FlatList
        data={prestamos}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          !cargando ? (
            <Text>No hay préstamos registrados.</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>
              {item.equipos?.nombre}
            </Text>

            <Text>Código: {item.equipos?.codigo}</Text>
            <Text>Estudiante: {item.perfiles?.nombre}</Text>
            <Text>Carné: {item.perfiles?.carne}</Text>
            <Text>Carrera: {item.perfiles?.carrera}</Text>
            <Text>Fecha de préstamo: {item.fecha_prestamo}</Text>
            <Text>Fecha de devolución: {item.fecha_devolucion}</Text>

            <Text style={styles.status}>
              Estado: {item.estado.toUpperCase()}
            </Text>

            {item.estado === 'pendiente' && (
              <View style={styles.actions}>
                <Pressable
                  style={styles.approve}
                  onPress={() => cambiarEstado(item.id, 'aprobado')}
                >
                  <Text style={styles.buttonText}>
                    Aprobar
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.reject}
                  onPress={() => cambiarEstado(item.id, 'rechazado')}
                >
                  <Text style={styles.buttonText}>
                    Rechazar
                  </Text>
                </Pressable>
              </View>
            )}

            {item.estado === 'aprobado' && (
              <Pressable
                style={styles.return}
                onPress={() => cambiarEstado(item.id, 'devuelto')}
              >
                <Text style={styles.buttonText}>
                  Marcar como devuelto
                </Text>
              </Pressable>
            )}
          </View>
        )}
      />

      <Pressable
        onPress={() => router.back()}
        style={styles.back}
      >
        <Text style={{ color: '#2563EB' }}>
          Volver
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#F1F5F9',
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#17365D',
    marginBottom: 15,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 15,
  },
  filter: {
    backgroundColor: '#E2E8F0',
    padding: 8,
    borderRadius: 7,
  },
  selected: {
    backgroundColor: '#17365D',
  },
  filterText: {
    fontSize: 10,
    color: '#334155',
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#17365D',
    marginBottom: 8,
  },
  status: {
    fontWeight: 'bold',
    marginTop: 10,
    color: '#D97706',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  approve: {
    flex: 1,
    backgroundColor: '#16A34A',
    padding: 11,
    borderRadius: 7,
  },
  reject: {
    flex: 1,
    backgroundColor: '#DC2626',
    padding: 11,
    borderRadius: 7,
  },
  return: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 7,
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loading: {
    marginBottom: 10,
    color: '#64748B',
  },
  back: {
    padding: 12,
    alignItems: 'center',
  },
});
