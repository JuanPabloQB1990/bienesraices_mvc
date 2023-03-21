import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'
import cookieParser from 'cookie-parser' // npm i cookie-parser
import csrf from 'csurf'
import propiedadRoutes from './routes/propiedadRoutes.js'
import db from './config/db.js'

// Crear APP
const app = express()  

//Habilitar lectura de datos de formularios
app.use( express.urlencoded({extended: true}) )

// habilitar cookie-parser
app.use(cookieParser())

// habilitar CSRF
app.use(csrf({cookie:true}))

//conexion base de datos
try {
    await db.authenticate();
    db.sync();
    console.log('Se conecto correctamente a la base de datos');
} catch (error) {
    console.log(error);
}


// Habllitar Pug
app.set('view engine', 'pug')
app.set('views', './view')

//Carpeta publica
app.use( express.static('public')) 

//Routing
app.use('/auth', usuarioRoutes )
app.use('/', propiedadRoutes )

app.get('/', (req, res) => {
    res.send('<h1>Welcome Home!</h1>');
})

const port = 5000;
app.listen(port, () => {
    console.log("conectado al puerto 5000");
})