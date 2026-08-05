interface Usuario{ //Clase
    id: number;
    nombre: string;
    email: string;
    activo?: boolean; //? significa que puede tener valor null
}

const ana : Usuario = { //Objeto
    id: 1,
    nombre: "Ana",
    email: "ana@gmail.com",
    activo: true
}
console.log("Id", ana.id, " ", "Nombre", ana.nombre);

// Tipo Personalizado
type ID = string | number;

let id: ID = "Hola";
let otroid: ID = 3;
let idExtra: ID = false; //Debemos evitar que sea posible
console.log(id, otroid, idExtra);

type Estado = "activo" | "inactivo" | "baneado";

let numeros: number[] = [1, 2, 3, 4, 5];
let frutas: Array<String> = ["Manzana", "Pera", "Naranja"];

//El tipo se infiere a traves del valor NO RECOMENDADO
let apellido = 10;
//Imprime como texto el tipo de una variable
console.log(typeof apellido);

function sumar(a: number, b: number): number{
return a+b;
};

//Arrow Function
const dividir = (a:number, b:number): number => {
    if(b === 0){
        throw new Error ("No se puede dividir entre 0");
    }
    return a/b;
};

let saldo = "10.30";
let saldo2 = 10.30;
console.log('comparando saldos', saldo === saldo2); //False  Compara valor y tipo
console.log('comparando saldos', saldo == saldo2); //True  Compara valor

//Parametros opcionales
const saludar = (nombre: string, edad?: number): string => {
    return `Hola ${nombre} ${edad ? "tienes " + edad + " años" : ""}`;
};

const saludar2 = (nombre: string, edad: number = 18): string => {
    return `Hola ${nombre} ${edad ? "tienes " + edad + " años" : ""}`;
};

console.log(saludar("Aroldo", 20));
console.log(saludar("Aroldo"));

console.log(saludar2("Aroldo", 20));
console.log(saludar2("Aroldo"));
