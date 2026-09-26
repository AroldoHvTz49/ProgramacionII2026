import{View, Text} from "react-native";



export default function TarjetaCentrada() {
    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f4f4f4",
        }}>
            <View style = {{
                padding: 20,
                backgroundColor: "#fff",
                borderRadius: 10,
            }}>
                <Text style = {{
                    fontSize: 18}}>
                        ¡Hola!
                </Text>
            </View>
        </View>
    );
}
    