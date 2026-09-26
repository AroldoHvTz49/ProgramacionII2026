import { Image } from 'expo-image';
import { Platform, StyleSheet, Button, Alert, Text, TextInput } from 'react-native';
import {useState} from 'react'; // Para manejar el estado del botón

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';


export default function HomeScreen() {

  const [contador, setContador] = useState(0);// Estado para contar los clics del botón

  function buttonClick(e: any){
    if(Platform.OS === "web"){
      window.alert("Hola Web");
    }else{
      Alert.alert("Hola Mobile");
    }
  };

  function incrementar(e: any){
    setContador(anterior => anterior + 1);
  }


  

  function Saludar(nombre: string, apellido: string){
  let message: string = "Hola como estas?" + " " + nombre + " " + apellido;
  if (Platform.OS === 'web') {
    window.alert(message);
  } else {
    Alert.alert(message);
  }
}

function Saludo(props: {nombre: string, apellido: string}){
 return (
  <Button title="Has click aca" onPress={()=>Saludar(props.nombre, props.apellido)} ></Button>
 )  
}

const [nombre, setNombre] = useState("")

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <Button title="Haz Click aca" onPress={buttonClick}></Button>
      <Button title="Aumentar" onPress={incrementar}></Button>
      <ThemedText>Conteo Actual: {contador} </ThemedText>



      <Saludo nombre={nombre} apellido=''/>

      <Text>Hola {nombre}</Text>

      <TextInput style={{backgroundColor:"white", width:"50%"}} placeholder="Ingrese su nombre"
                 value={nombre}
                 onChangeText={(text: string)=> setNombre(text) }
      ></TextInput>

      

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
