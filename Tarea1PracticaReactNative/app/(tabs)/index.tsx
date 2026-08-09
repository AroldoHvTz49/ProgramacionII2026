import {
  Alert,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  Pressable,
} from "react-native";

function Logo() {
  return (
    <Image source={require("@/assets/images/umg.png")} style={styles.Logo} />
  );
}

function Nombre() {
  return <Text style={styles.textos}>Aroldo Waldemar Nájera Castro</Text>;
}

function Carrera() {
  return <Text style={styles.textos}>Ingeniería en Sistemas</Text>;
}

function Carne() {
  return <Text style={styles.textos}>Carné: 0907-25-4863</Text>;
}

function Boton() {
  return (
    <Pressable
      style={styles.boton}
      onPress={() => {
        if (Platform.OS === "web") {
          window.alert("Hola desde la Web, me llamo Aroldo Nájera");
        } else {
          Alert.alert("Hola desde el Mobile, me llamo Aroldo Nájera");
        }
      }}
    >
      <Text style={styles.textoBoton}>Ver Perfil</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.contenedor}>

      <Logo />
      <Nombre />
      <Carrera />
      <Carne />
      <Boton />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#1D3D47",
  },

  textos: {
    fontSize: 26,
    fontFamily: "BebauesNeue-Regular",
    color: "#ffffff",
    borderColor: "#ffffff",
    backgroundColor: "#42acd2",
    borderRadius: 20,
    borderWidth: 2,
    padding: 10,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },

  boton: {
    width: 150,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#42acd2",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#ffffff",
  },

  textoBoton: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "BebauesNeue-Regular",
  },

  Logo: {
    height: 150,
    width: 150,
    marginBottom: 40,
  },
});
