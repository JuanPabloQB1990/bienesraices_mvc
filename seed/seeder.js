import categorias from './categorias.js'
import precios from './precios.js'
import { Categoria, Precio, Usuario } from '../models/index.js'
import db from '../config/db.js'
import { exit } from 'node:process'
import usuarios from './usuarios.js'

// este archivo seeder.js o funcion se ejecuta con un script en packege.json

const importarDatos = async () => {
    try {
        // Autenticar
        await db.authenticate()

        // Generar columnas
        await db.sync()

        // Insertar los Datos de forma asincrona
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios)
        ])

        console.log("Datos inserdatos Correctamante");
        exit()
        
    } catch (error) {
        console.log(error);
        exit(1)
    }
}

// limpiar tablas indicadas de la base de datos con el metodo de sequelize destroy
const eliminarDatos = async () => {
    try {
        /* await Promise.all([
            Categoria.destroy({ where: {}, truncate: true}), // truncate: limpia los id desde el principio
            Precio.destroy({ where: {}, truncate: true})
        ]) */

        // eliminar datos con force
        await db.sync({force: true}) 

        console.log("Datos Eliminados Correctamante");
        exit()
    }catch (error) {
        console.log(error);
        exit(1)
    }
}

// se ejecuta la funcio importarDatos si el script ejecutado tiene en la posicion 2  -i
if(process.argv[2] === "-i"){
    importarDatos()
}

if(process.argv[2] === "-e"){
    eliminarDatos()
}