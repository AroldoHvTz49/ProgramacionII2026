import { useState } from "react";
import { router } from "expo-router";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { supabase } from "@/database/supabase";

export default function LoginScreen() {
  const [registro, setRegistro] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const autenticar = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Ingrese correo y contraseña.");
      return;
    }

    if (registro) {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        Alert.alert("Error al registrarse", error.message);
        return;
      }

      Alert.alert("Registro exitoso", "Usuario creado correctamente.");
      setRegistro(false);
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        Alert.alert("Error al iniciar sesión", error.message);
        return;
      }

      router.replace("/products");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {registro ? "Crear cuenta" : "Iniciar sesión"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable style={styles.boton} onPress={autenticar}>
        <Text style={styles.textoBoton}>
          {registro ? "Registrarse" : "Iniciar sesión"}
        </Text>
      </Pressable>

      <Pressable onPress={() => setRegistro(!registro)}>
        <Text style={styles.enlace}>
          {registro ? "Ya tengo una cuenta" : "No tengo una cuenta"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
  },

  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },

  input: {
    borderWidth: 1,
    borderColor: "#999",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },

  boton: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  textoBoton: {
    color: "white",
    fontWeight: "bold",
  },

  enlace: {
    textAlign: "center",
    marginTop: 20,
  },
});
