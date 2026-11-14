//Ejercicio 3
import {View, Text, FlatList} from 'react-native'

const estudiantes = [
    {id: "1", nombre: "Aroldo"}, 
    {id: "2", nombre:"Neres"}, 
    {id: "3", nombre:"Juan"}, 
    {id: "4", nombre:"Sapo"}
];

function ListaEstudiantes(){
    return(
        <View>
            <FlatList data={estudiantes}
                    renderItem={({item}) => (<Text>{item.nombre}, id: {item.id} </Text>)}
                    keyExtractor={(item) => item.id}/>
        </View>
    )
}

export default ListaEstudiantes;