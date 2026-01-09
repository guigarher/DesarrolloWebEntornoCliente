//Inferencia

let a = 5
let b = 6

let c = a + b

function saludar(nombre:string){
    console.log(`Hola ${nombre}`)
}

saludar("Guillermo")

let usuario = {
    nombre: "Guillermo",
    rol: "Admin",
    edad: 34
}

//forma incorrecta
function saludar2({nombre:string, edad:number}){
    console.log(`Hola ${nombre}, tienes ${edad} años`)
}
//solucion 1
function saludar3({nombre, edad}:{nombre:string, edad:number}){
    console.log(`Hola ${nombre}, tienes ${edad} años`)
}
//solucion 2
function saludar4(persona:{nombre:string, edad:number}){
    const {nombre, edad} = persona
    console.log(`Hola ${nombre}, tienes ${edad} años`)
}

//Podemos tipear los tipos de datos de salida de la funcion

function saludar5(persona:{nombre:string, edad:number}): number{
    const {nombre, edad} = persona
    console.log(`Hola ${nombre}, tienes ${edad} años`)
    return edad
}

//Tipo de dato especial, el tipo never

function throwError(message:string):never {
    throwError(message)
}

let cadena : number
cadena = saludar5({nombre: "Guillermo", edad:34})

//caso de uso de pasar funciones como parametros

const decirHolaDesdeFuncion = (fn : (nombrePersona:string) => void) => { fn("Guillermo")}

const decirHola = ( (nombre:string)=> {
    console.log(`Hola ${nombre}`)
})

decirHolaDesdeFuncion(decirHola)

//arrow functions

//version 1

const sumar = (a:number, b:number) : number => {
    return a + b
}

//version 2 

const restar : (a:number, b:number) => number=(a,b) => {
    return a - b
}



