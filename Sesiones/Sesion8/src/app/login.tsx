import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { authRepo } from ".";

export default function LoginScreen() {
    const theme = useTheme();
    const router = useRouter();
    
     const [user, setUser] = useState({email:"", password: ""})
     const [error, setError] = useState("")
    
       const iniciarSesion = async () => {
        try{
         const response = await authRepo.iniciarSesion(user.email, user.password);
         if (!response.id){
           Alert.alert("El usuario no existe")
         }
         router.replace("/")

        }catch(error: any){
          setError(error.message);
        }
       }

    return (
    <View>
    <ThemedView type="backgroundElement" style={styles.modalCard}>
        <ThemedText type="subtitle">
            Iniciar sesion
        </ThemedText>

        <ThemedView type="backgroundElement">
            <ThemedText type="smallBold">Email</ThemedText>
            <TextInput
                style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
                value={user.email}
                onChangeText={(text) => {
                    setUser((prev) => ({ ...prev, email: text }))
                }}
                placeholder="Email"
            />
        </ThemedView>
        <ThemedView type="backgroundElement">
            <ThemedText type="smallBold">Password</ThemedText>
            <TextInput
                style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
                value={user.password}
                onChangeText={(text) => {
                    setUser((prev) => ({ ...prev, password: text }))
                }}
                placeholder="Password"
            />
        </ThemedView>
        <Pressable onPress={iniciarSesion}>
            <ThemedView type="backgroundSelected" style={styles.saveButton}>
                <ThemedText type="small" style={styles.saveButtonText}>
                    Iniciar sesion
                </ThemedText>
            </ThemedView>
        </Pressable>
        {error != "" && 
          <Text style={{color:"red"}}>
              {error}      
          </Text>
        } 
    </ThemedView>
    </View >)
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
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
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
});
