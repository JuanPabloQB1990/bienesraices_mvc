import express from "express";
import {
  admin,
  crear,
  guardarPropiedad,
  agregarImagen,
  almacenarImagen,
  editarPropiedad,
  guardarCambios,
  eliminarPropiedad,
  mostrarPropiedad
} from "../controllers/propiedadControllers.js";
import { body } from "express-validator"; // npm i express-validator
import protegerRuta from "../middleware/protegerRuta.js"; // para proteger rutas
import upload from "../middleware/subirImagen.js"; // esta funcion es para guardar imagenes en el servidor

const router = express.Router();

router.get("/mis-propiedades", protegerRuta, admin); // protegiendo rutas con middleware
router.get("/propiedades/crear", protegerRuta, crear); // ruta que renderiza formulario crear propiedad

// ruta donde enviamos los datos del formulario crear propiedad
router.post(
  "/propiedades/crear",

  // body se utiliza desde el routing... check desde el controller
  body("titulo").notEmpty().withMessage("El titulo del anuncio es Obligatorio"),
  body("descripcion")
    .notEmpty()
    .withMessage("la descripción del anuncio es Obligatorio")
    .isLength({ max: 200 })
    .withMessage("La Descripcón es muy extensa"),
  body("categoria").isNumeric().withMessage("Selecciona una categoria"),
  body("precio").isNumeric().withMessage("Selecciona un rango de precios"),
  body("habitaciones")
    .isNumeric()
    .withMessage("Selecciona una cantidad de habitaciones"),
  body("estacionamiento")
    .isNumeric()
    .withMessage("Selecciona una cantidad de estacionamientos"),
  body("wc").isNumeric().withMessage("Selecciona una cantidad de baños"),
  body("lat")
    .notEmpty()
    .withMessage("Selecciona una ubicacion de la Propiedad"),
  protegerRuta,
  guardarPropiedad
);

// esta ruta se ejecuta cuandodas click en el botonañadir imagen en el formulario crear propiedad
router.get("/propiedades/agregar-imagenes/:id", protegerRuta, agregarImagen);

router.post(
  "/propiedades/agregar-imagenes/:id",
  protegerRuta,
  // upload se llama desde el middleware subirImagen.js para guardar imagen en servidor
  upload.single("imagen"), // single => una sola imagen ---- array => para muchas imagenes
  almacenarImagen
);

router.get("/propiedades/editar/:id", protegerRuta, editarPropiedad);

// ruta para enviar los datos del front para validar y hacer el cambio
router.post(
  "/propiedades/editar/:id",

  // body se utiliza desde el routing... check desde el controller
  body("titulo").notEmpty().withMessage("El titulo del anuncio es Obligatorio"),
  body("descripcion")
    .notEmpty()
    .withMessage("la descripción del anuncio es Obligatorio")
    .isLength({ max: 200 })
    .withMessage("La Descripcón es muy extensa"),
  body("categoria").isNumeric().withMessage("Selecciona una categoria"),
  body("precio").isNumeric().withMessage("Selecciona un rango de precios"),
  body("habitaciones")
    .isNumeric()
    .withMessage("Selecciona una cantidad de habitaciones"),
  body("estacionamiento")
    .isNumeric()
    .withMessage("Selecciona una cantidad de estacionamientos"),
  body("wc").isNumeric().withMessage("Selecciona una cantidad de baños"),
  body("lat")
    .notEmpty()
    .withMessage("Selecciona una ubicacion de la Propiedad"),
  protegerRuta,
  guardarCambios
);

router.post("/propiedades/eliminar/:id", protegerRuta, eliminarPropiedad);

router.get('/propiedad/:id', mostrarPropiedad)

export default router;
