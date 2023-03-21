import express from "express"
import { admin, crear, guardarPropiedad, agregarImagen, almacenarImagen} from "../controllers/propiedadControllers.js"
import { body } from 'express-validator'  // npm i express-validator
import protegerRuta from "../middleware/protegerRuta.js" // para proteger rutas
import upload from '../middleware/subirImagen.js' // esta funcion es para guardar imagenes en el servidor

const router = express.Router()

router.get('/mis-propiedades', protegerRuta, admin) // protegiendo rutas con middleware
router.get('/propiedades/crear', protegerRuta, crear) // ruta que renderiza formulario crear propiedad
router.post('/propiedades/crear', 

// body se utiliza desde el routing... check desde el controller
    body('titulo').notEmpty().withMessage('El titulo del anuncio es Obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('la descripción del anuncio es Obligatorio')
        .isLength({ max: 200 }).withMessage('La Descripcón es muy extensa'),
    body('categoria').isNumeric().withMessage('Selecciona una categoria'),
    body('precio').isNumeric().withMessage('Selecciona un rango de precios'),
    body('habitaciones').isNumeric().withMessage('Selecciona una cantidad de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona una cantidad de estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona una cantidad de baños'),
    body('lat').notEmpty().withMessage('Selecciona una ubicacion de la Propiedad'),
    protegerRuta,
    guardarPropiedad 

) // ruta que renderiza formulario crear propiedad

// esta ruta se ejecuta cuandodas click en el botonañadir imagen en el formulario crear propiedad
router.get('/propiedades/agregar-imagenes/:id', protegerRuta, agregarImagen)


router.post('/propiedades/agregar-imagenes/:id', 
    protegerRuta,
    upload.single("imagen"),
    almacenarImagen
) 
// single => una sola imagen ---- array => para muchas imagenes
export default router