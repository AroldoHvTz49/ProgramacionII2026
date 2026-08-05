//Variable: es un espacio en memoria que almacena un valor
let nombre: string = "Aroldo";
let edad: number = 30;
let booleano: boolean = true;
let vacio: null = null;
let nada: undefined = undefined;

//Arrays: Es un conjunto de elementos del mismo tipo
let numeros: number[] = [1, 2, 3, 4, 5];
let nombres: string[] = ["Aroldo", "Juan", "Pedro"];
let booleanos: boolean[] = [true, false, true];

//Tuples: es un array con un número fijo de elementos y tipos específicos
let persona: [string, number] = ["Juan", 10];

//Any (Evitar): es un tipo que puede contener cualquier valor, pero se recomienda evitar su uso para mantener la seguridad de tipos
let dinamico: any = "Puede ser cualquier tipo de dato";

console.log("Hola: " + nombre);