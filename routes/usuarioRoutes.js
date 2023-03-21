import express from 'express'
import { formularioLogin, autenticar, formularioRegistro, confirmar, registrar, formularioOlvideRegistro, resetPassword, comprobarToken, nuevoPassword } from '../controllers/usuarioController.js'

const router = express.Router()

router.get('/login', formularioLogin) // llama la funcion que renderiza el form de login
router.post('/login', autenticar) // se ejecuta con el boton de iniciar sesion

router.get('/registro', formularioRegistro) // llama la funcion que renderiza el form de registro
router.post('/registro', registrar) // se ejecuta con el boton de registrar

router.get('/confirmar/:token', confirmar) //se ejecuta cuando se da click al enlace enviado al email de confirmar cuenta 

router.get('/olvide_password', formularioOlvideRegistro) // renderiza el formulario para recuperar password
router.post('/olvide_password', resetPassword) // se ejecuta al hacer click en enviar instrucciones

router.get('/olvide_password/:token', comprobarToken) // se ejecuta cuando se hace click en el enlace enviado al email
router.post('/olvide_password/:token', nuevoPassword) // se ejecuta cuando presionas guardar password nueva


export default router