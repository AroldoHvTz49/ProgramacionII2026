import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [carne, setCarne] = useState("");
  const [carrera, setCarrera] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [esError, setEsError] = useState(false);

  const seleccionarFoto = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
    }
  };

  const registrar = async () => {
    setMensaje("");
    setEsError(false);

    if (
      !nombre.trim() ||
      !carne.trim() ||
      !carrera.trim() ||
      !correo.trim() ||
      !password
    ) {
      setMensaje("Complete todos los campos.");
      setEsError(true);
      return;
    }

    if (password.length < 6) {
      setMensaje("La contraseña debe tener al menos 6 caracteres.");
      setEsError(true);
      return;
    }

    try {
      setCargando(true);

      const { data, error } = await supabase.auth.signUp({
        email: correo.trim(),
        password,
        options: {
          data: {
            nombre: nombre.trim(),
            carne: carne.trim(),
            carrera: carrera.trim(),
          },
        },
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error("No se pudo crear el usuario.");
      }

      console.log("USUARIO REGISTRADO:", data.user.id);
      console.log("SESION:", data.session);

      if (foto && data.session) {
        const respuesta = await fetch(foto);
        const archivo = await respuesta.blob();

        if (!archivo.type.startsWith("image/")) {
          throw new Error("El archivo seleccionado no es una imagen válida.");
        }

        const extension = archivo.type === "image/png" ? "png" : "jpg";
        const nombreArchivo = `${data.user.id}/perfil.${extension}`;

        const { error: errorFoto } = await supabase.storage
          .from("fotografias")
          .upload(nombreArchivo, archivo, {
            upsert: true,
            contentType: archivo.type,
          });

        if (errorFoto) throw errorFoto;

        const { data: imagen } = supabase.storage
          .from("fotografias")
          .getPublicUrl(nombreArchivo);

        const { error: errorPerfil } = await supabase
          .from("perfiles")
          .update({ foto: imagen.publicUrl })
          .eq("id", data.user.id);

        if (errorPerfil) throw errorPerfil;
      }

      if (data.session) {
        router.replace("/estudiante");
      } else {
        setMensaje(
          "Cuenta creada. Revise su correo para verificarla antes de iniciar sesión.",
        );
        setEsError(false);
      }
    } catch (error: any) {
      console.error("ERROR DE REGISTRO:", error);

      setMensaje(
        "Error al registrar: " +
          (error.message || "Ocurrió un error inesperado."),
      );

      setEsError(true);
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro de estudiante</Text>

      <Text style={styles.subtitle}>Complete su información personal</Text>

      <Pressable style={styles.photoButton} onPress={seleccionarFoto}>
        {foto ? (
          <Image source={{ uri: foto }} style={styles.photo} />
        ) : (
          <Text style={styles.photoText}>Agregar fotografía</Text>
        )}
      </Pressable>

      <Text style={styles.label}>Nombre completo</Text>

      <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

      <Text style={styles.label}>Carné universitario</Text>

      <TextInput style={styles.input} value={carne} onChangeText={setCarne} />

      <Text style={styles.label}>Carrera</Text>

      <TextInput
        style={styles.input}
        value={carrera}
        onChangeText={setCarrera}
      />

      <Text style={styles.label}>Correo electrónico</Text>

      <TextInput
        style={styles.input}
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Contraseña</Text>

      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={registrar} disabled={cargando}>
        <Text style={styles.buttonText}>
          {cargando ? "Registrando..." : "REGISTRAR ESTUDIANTE"}
        </Text>
      </Pressable>

      {mensaje !== "" && (
        <Text
          style={[styles.message, { color: esError ? "#DC2626" : "#15803D" }]}
        >
          {mensaje}
        </Text>
      )}

      <Pressable onPress={() => router.replace("/")}>
        <Text style={styles.link}>Volver al inicio de sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 25,
    backgroundColor: "#F1F5F9",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#17365D",
  },
  subtitle: {
    color: "#64748B",
    marginBottom: 20,
    marginTop: 5,
  },
  photoButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#DBEAFE",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoText: {
    color: "#17365D",
    fontSize: 12,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    color: "#334155",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    padding: 13,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#17365D",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  message: {
    textAlign: "center",
    marginTop: 15,
    fontWeight: "600",
  },
  link: {
    textAlign: "center",
    color: "#2563EB",
    marginTop: 20,
  },
});
