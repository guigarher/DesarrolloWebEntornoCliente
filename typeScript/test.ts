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

/*forma incorrecta de objeto por parametro
function saludar2({nombre:string, edad:number}){
    console.log(`Hola ${nombre}, tienes ${edad} años`)
}
*/
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
    throw new Error(message)
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

//objetos en TypeScript

// sin tipar

let heroe = {
    nombre : "Thor",
    poder : 1500
}

function crearHeroe(nombre:string, poder:number){
    return{nombre, poder}
}

const thor = crearHeroe("Thor", 1500)


//Crear Alias en TS para crear un tipo propio

type Heroe = {
    //Mandatory properties
    readonly id : number,
    nombre : string,
    poder : number,
    //Optional properties
    isActive? : boolean
}

let heroe1 : Heroe = {
    id: 1,
    nombre : "Spiderman",
    poder : 900
}

function crearHeroe1(id:number, nombre:string, poder:number):Heroe{
    return{id, nombre, poder}
}
const spiderman = crearHeroe1(1, "Spiderman", 900)
/*
function crearHeroe1(id:number, nombre:string, poder:number):Heroe{
    return{id: crypto.randomUUID(), nombre, poder}
}
*/

//TEMPLATE UNION type

type HeroeID = `${string}-${string}-${string}-${string}-${string}`

let aHeroID : HeroeID = "asd-asd-asd-asd-asd"

type HexadecimalColor = `#${string}`
const color : HexadecimalColor = "#ff0000"

//UNIONT TYPES

type HeroeType = "Dios" | "SemiDios" | "SuperPoderes" | "RicoConPasta"

let aHeroeType : HeroeType = "Dios"

// vamos a ver los INTERSECTION TYPES

type UserRequiredInfo ={
    nombre : string,
    apellidos : string,
    dni : string
}

type UserOptionalInfo = {
    telefono? : string,
    fechaNacimiento? : Date,
    direccion? : {
        calle : string,
        codigoPostal : number
    }
}

type User = UserRequiredInfo & UserOptionalInfo

let userBasicInfo : UserRequiredInfo = {
    nombre : "Guillermo",
    apellidos : "García Hernández",
    dni : "12345678A"
}

function createUser(input : UserRequiredInfo): User {
    return {
        ...input
    }
}

//TYPE INDEXING --- EXTRAEMOS EL TIPO DE DATOS DE UNA PROPIEDAD DE UN TIPO DE DATO 

let direccion : UserOptionalInfo["direccion"]={
    calle : "Calle Falsa 123",
    codigoPostal : 28080
}

const pedri = {
    nombre : "Pedri",
    equipo : "FC Barcelona",
    ciudad : "Barcelona",
    deporte : "Fútbol"
}

type Deportista = typeof pedri

let cristiano : Deportista = {
    nombre : "Cristiano",
    equipo : "Al Nassr",
    ciudad : "Riad",
    deporte : "Fútbol"
}

// Extraemos el tipo de dato del valor de retorno de una función

function crearDeportista(){
    return{
        nombre : "Pedri",
        equipo : "FC Barcelona",
        ciudad : "Barcelona",
        deporte : "Fútbol"
    }
}

type DeportistaFromFunction = ReturnType<typeof crearDeportista>

let messi : DeportistaFromFunction = {
    nombre : "Messi",
    equipo : "Inter Miami",
    ciudad : "Miami",
    deporte : "Fútbol"
}










