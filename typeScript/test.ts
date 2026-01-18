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


//Arrays

let valores = []
valores.push(1)
valores.push("HOLA")
valores.push(true)

let numeros:number[]=[1,2,3]
numeros.push(4)
//numeros.push("HOLA") no nos deja

//1ª forma de declaración de un array de String
const lenguajes:string[]=[]

const arrayAlterno : (string|number) [] = []

//2ª forma de declaración
const lenguajes2:Array<String>=[]

const arrayAlterno2 : Array<String|number> = []


//Esto es un arrayo bien de string o bien de tipo number
const arrayTipoAElegir : string[] | number [] = []

//Podemos crear arrays con los tipos propios
const heroes : Array<Heroe> = []

//Vamos a imaginarnos un tablero de 3 en raya
/*
[
['X','0','X'],      <--- string[]
['','0',''],        <--- string[]
['X','','X']       <--- string[]
]
*/ 

let tablero:string[][] = []

tablero = [
    ['X','0','X'],      
    ['X','0','X'],        
    ['X','0','X']
]
tablero[0][1] = "WTF!"

type ValorPermitido = 'X' | '0' |''
let tablero2:ValorPermitido[][] = []

tablero2 = [
    ['X','0','X','X','0'],      
    ['X','0','X'],
    ['X','0','X'],        
    ['X','0','X']
]
//tablero2[0][1] = "WTF!" da error ahora, aún así no estamos controlando el tamaño del 3 en raya

type TableroMejorado = [
    [ValorPermitido, ValorPermitido, ValorPermitido],
    [ValorPermitido, ValorPermitido, ValorPermitido],
    [ValorPermitido, ValorPermitido, ValorPermitido]
]

let tablero3 : TableroMejorado = [
    ['X','0','X',],      
    ['X','0','X'],        
    ['X','0','X']
]









