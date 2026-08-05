import { readFile } from "node:fs/promises";

function AsincronoConPromesas(): void {
    console.log("hola desde clase 2");
    //se deben identificar los caracteres
    let textoPromise = readFile("demo.txt", "utf-8");
    textoPromise.then((data:string) => {
        console.log(data);
        console.log("Finalizado");
    });
}

AsincronoConPromesas();

async function AsincronoConAwait(): Promise<void> {
    console.log("hola desde clase 2 async/await");
    try {
        let texto = await readFile("demo.txt", "utf-8");
        console.log(texto);
        console.log("Finalizado async/await");
    } catch (error) {
        console.error("Error al leer el archivo:", error);
    }
}

AsincronoConAwait();