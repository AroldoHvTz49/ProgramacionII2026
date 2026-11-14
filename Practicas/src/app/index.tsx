import { use, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Pressable,
} from "react-native";
import Producto from "./producto";
import ListaEstudiantes from "./Estudiantes";

//Ejercicio 1
function App() {
  return (
    <View>
      <Producto nombre="Monster Ultra" precio={15} />
      <Producto nombre="Coca Cola" precio={5} />
      <Producto nombre="Snickers" precio={10} />
    </View>
  );
}

//Ejercicio 2

function Formulario() {
  const [nombre, setNombre] = useState("");

  function Mostrar() {
    alert("Hola " + nombre);
  }

  return (
    <View>
      <TextInput placeholder="Escribe tu nombre" onChangeText={setNombre} />
      <Button title="Mostrar tu Nombre" onPress={Mostrar} />
    </View>
  );
}

//Ejercicio 4

const tareasIniciales = [
  { id: "1", nombre: "Estudiar TypeScript" },
  { id: "2", nombre: "Practicar FlatList" },
  { id: "3", nombre: "Hacer la tarea de React Native" },
];

function Tareas() {
  const [tareas, setTareas] = useState(tareasIniciales);
  const [nombre, setNombre] = useState("");

  function Agregar() {
    const id = tareas.length + 1;
    const key = String(id);
    setTareas([...tareas, { id: key, nombre: nombre }]);
    setNombre("");
  }

  function Eliminar(id: string) {
    const nuevasTareas = tareas.filter((item) => item.id !== id);

    setTareas(nuevasTareas);
  }

  return (
    <View>
      <br />
      <br />
      <br />
      <br />
      <FlatList
        data={tareas}
        renderItem={({ item }) => (
          <View>
            <Text>
              {item.id}: {item.nombre}
            </Text>

            <Pressable onPress={() => Eliminar(item.id)}>
              <Text>Eliminar</Text>
            </Pressable>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <br />
      <TextInput
        placeholder="Escribe tu tarea"
        value={nombre}
        onChangeText={setNombre}
      />
      <Button title="Agregar Tarea" onPress={Agregar} />
    </View>
  );
}

export default function HomeScreen() {
  return <Tareas />;
}
