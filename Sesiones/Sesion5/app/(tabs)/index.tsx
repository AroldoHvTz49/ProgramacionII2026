import { Image } from 'expo-image';
import { Platform, StyleSheet, Button, Alert, ScrollView, View } from 'react-native';
import {useState} from 'react';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import Card from '@/components/card';
import Presentacion from '@/components/presentacion';



export default function HomeScreen() {

  // const [contador, setContador] = useState(0);

  // function buttonClick(e: any){
  //   if (Platform.OS === "web"){
  //     window.alert("Hola")
  //   }else{
  //     Alert.alert('Hola');
  //   }
  // }
  // function incrementar(e: any){
  //   setContador(anterior => anterior + 1)
  // }

  return (

    <View style={{flex: 1}}>
      <Presentacion/>
    </View>

    // <ParallaxScrollView
    //   headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    //   headerImage={
    //     <Image
    //       source={require('@/assets/images/partial-react-logo.png')}
    //       style={styles.reactLogo}
    //     />
    //   }>
    //  <Button title='Haz click aca' onPress={buttonClick} ></Button>
    //  <Button title='Aumentar' onPress={incrementar} ></Button>
    //  <ThemedText>Conteo actual: {contador}</ThemedText>

    //   <Card/>
    //   <Presentacion/>

    // </ParallaxScrollView>
  );
}

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });