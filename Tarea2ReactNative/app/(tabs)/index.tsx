import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
  Text,
  View,
  TextInput,
  FlatList,
  Alert,
} from "react-native";

export default function Tarea() {
  function Eliminar(item: string) {
    if (Platform.OS === "web") {
      const confirmar = window.confirm(
        "¿Está seguro de eliminar la tarea: " + item + "?",
      );
    } else {
      Alert.alert(
        "Confirmacion",
        "¿Está seguro de eliminar la tarea: " + item + "?",
      );
    }
  }

  const [mostrar, setMostrar] = useState(false);
  const [tarea, setTarea] = useState("");
  const [lista, setLista] = useState<string[]>([
    "Calculo II",
    "Tarea Progra",
    "Fisica II",
  ]);

  return (
    <ScrollView style={Styles.fondo} contentContainerStyle={Styles.alinear}>
      <Pressable
        style={Styles.botonNuevaTarea}
        onPress={() => setMostrar(true)}
      >
        <Text style={Styles.textoBoton}>Crear Nueva Tarea</Text>
      </Pressable>

      {mostrar && (
        <TextInput
          style={Styles.input}
          placeholder="Ingresa la nueva tarea"
          value={tarea}
          onChangeText={(text) => setTarea(text)}
        ></TextInput>
      )}

      {tarea && (
        <Pressable
          style={Styles.botonGuardarTarea}
          onPress={() => {
            setMostrar(false);
            setLista([...lista, tarea]);
            setTarea("");
          }}
        >
          <Text style={Styles.textoBoton}>Guardar Tarea</Text>
        </Pressable>
      )}

      <FlatList
        style={Styles.lista}
        data={lista}
        renderItem={({ item }) => (
          <View style={Styles.vistaLista}>
            <Text style={Styles.textoLista}>{item}</Text>

            <Pressable
              style={Styles.botonEliminar}
              onPress={() => Eliminar(item)}
            >
              <Text style={Styles.textoBoton}>Eliminar</Text>
            </Pressable>
          </View>
        )}
      />
    </ScrollView>
  );
}

const Styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: "#142da7",
    padding: 10,
  },

  botonNuevaTarea: {
    margin: 20,
    width: 400,
    height: 40,
    backgroundColor: "#accf53",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    borderColor: "#000",
    borderWidth: 3,
  },

  alinear: {
    alignItems: "center",
  },

  textoBoton: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  input: {
    borderColor: "#000000",
    borderRadius: 20,
    fontSize: 16,
    backgroundColor: "#accf53",
    color: "#fff",
    width: 400,
    height: 40,
    padding: 10,
    fontWeight: "bold",
    textAlign: "center",
    borderWidth: 3,
  },

  botonGuardarTarea: {
    margin: 20,
    width: 400,
    height: 40,
    backgroundColor: "#53cf70",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    borderColor: "#000",
    borderWidth: 3,
  },

  lista: {
    width: 400,
    height: 400,
    backgroundColor: "#ffffff",
    borderColor: "#000000",
    borderWidth: 4,
    margin: 20,
  },

  textoLista: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 20,
    margin: 5,
  },

  botonEliminar: {
    backgroundColor: "#ff0000",
    color: "#fff",
    width: 80,
    height: 40,
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    borderColor: "#000",
    borderWidth: 3,
    marginLeft: 5,
    marginTop: 2,
  },

  vistaLista: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
});
