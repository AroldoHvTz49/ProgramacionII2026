//Ejercicio 1
import {Text, View} from 'react-native';

interface ProductoProps{
    nombre: string;
    precio: number;
}

function Producto(props:ProductoProps){
    return(
        <View>
            <Text>Nombre del Producto: {props.nombre}, precio del producto: Q{props.precio} </Text>
        </View>
    )
}

export default Producto;