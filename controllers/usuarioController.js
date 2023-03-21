import Usuario from '../models/Usuario.js'
import { check, validationResult } from 'express-validator'
import { generarId, generarJWT } from '../helpers/tokens.js'
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js'
import bcrypt from 'bcrypt' // npm i bcrypt

// renderiza formulario de login
const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: "Iniciar Sesión",
        csrfToken: req.csrfToken(),
    })
}

// funcion se ejecuta al presionar el boton iniciar sesion
const autenticar = async(req, res) => {

    // valida el email y password
    await check('email').isEmail().withMessage('El email es obligatorio').run(req)
    await check('password').notEmpty().withMessage('Ingresa porfavor tu password').run(req)

    // crea un array deerroresen las validaciones anteriores
    let resultado = validationResult(req)

    // si hay errores muestra los errores en pantalla
    if(!resultado.isEmpty()) {
        return res.render('auth/login', {
               pagina: "Iniciar Sesion",
               errores: resultado.array(),
               csrfToken: req.csrfToken(),
               usuario: {
                    email: req.body.email

               }
        })
    }

    const { email, password } = req.body

    // comprobar si el usuario existe con el email
    const usuario = await Usuario.findOne({ where: { email } })

    // si no existe muestra el mensaje de error
    if (!usuario) {
        return res.render('auth/login',{
            pagina: "Iniciar Sesion",
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario no existe'}],
            usuario: {
                email,
            }
        })
    }

    // verifica si el usuario esta confirmado 
    if (!usuario.confirmado) {
        return res.render('auth/login',{
            pagina: "Iniciar Sesion",
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario no ha sido confirmado'}],
            usuario: {
                email,
            }
        })
    }

    // Revisar el password del front sea igual a la de la base de datos
    if(!usuario.verificarPassword(password)) { // funcion prototype del objeto modelo Usuario
        return res.render('auth/login',{
            pagina: "Iniciar Sesion",
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El password es incorrecto'}],
            usuario: {
                email,
            }
        })
    }

    // funcion que genera jwt para generar id de usuario
    const token = generarJWT({ id: usuario.id, nombre: usuario.nombre }) //funion llamada desde helpers/tokens.js

    // guardar token en cookie 
    return res.cookie('token', token, {
        httpOnly: true, // cookie segura
        //secure: true,
        //sameSite: true
    }).redirect('/mis-propiedades')

}

// renderiza el formulario de registro
const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        csrfToken: req.csrfToken(),
        pagina: "Crear Cuenta"
    })

}

// 
const registrar = async(req, res) => {
    // validation 
    await check('nombre').notEmpty().withMessage('el Nombre es obligatorio').run(req)
    await check('email').isEmail().withMessage('Formato de email no permitido').run(req)
    await check('password').isLength({ min:6}).withMessage('minimo 6 caracteres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('las Password no coinciden').run(req)

    let resultado = validationResult(req) // crea un array de errores

    // si el arreglo de errores no esta vacio
    if(!resultado.isEmpty()) {
        return res.render('auth/registro', {
               pagina: "Crear Cuenta",
               csrfToken: req.csrfToken(),
               errores: resultado.array(),
               usuario: {
                    nombre: req.body.nombre,
                    email: req.body.email

               }
        })
    }

    const { nombre, email, password, token } = req.body

    // Verifiar si el usuario esta duplicado
    const existeUsuario = await Usuario.findOne( { where : { email: req.body.email } } );

    if (existeUsuario) {
        return res.render('auth/registro', {
                pagina: "Crear Cuenta",
                errores: [{msg: 'el Usuario ya es registrado'}],
                csrfToken: req.csrfToken(),
                usuario:{
                    nombre: req.body.nombre,
                    email: req.body.email
                }
        })
    }

    // agrega registro ala tabla  usuarios
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId() // funcion se llama de helpers/tokens.js
    })

    // enviar email de cofirmacion al usuario
    emailRegistro({ // esta funcion se encuentra en helpers/emails.js
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    //muestra mensaje de confirmacion
    res.render('templates/mensaje', {
        pagina: ' Cuenta Creada Correctamente',
        mensaje: 'Hemos Enviado un Email con un enlace de Confirmación, presiona en el Enlace'
    })
}

// funcion que comprueba la cuenta
const confirmar = async(req, res) => {
    const { token } = req.params

    // verificar si el token es valido
    const usuario = await Usuario.findOne({ where: { token: token }})

    if (!usuario) {
        return res.render('auth/confirmar_cuenta',{
            pagina: "Error al confirmar su cuenta",
            mensaje: "Hubo un error al confirmar tu cuenta, itenta de nuevo",
            error: true
        })
    }

    // confirmar cuenta
    usuario.token = null
    usuario.confirmado = true

    await usuario.save() // guarda los cambios en el registro 

    res.render('auth/confirmar_cuenta',{
        pagina: "Cunta Confirmada",
        mensaje: "La Cuenta ha sido Confirmada Correctamente"
    })

}

const formularioOlvideRegistro = (req, res) => {
    res.render('auth/olvide_password', {
        csrfToken: req.csrfToken(),
        pagina: "Recupere su Password"
    })

    
}


const resetPassword = async(req, res) => {

    // validamos si es un email con el metodo isEmail de sequelize
    await check('email').isEmail().withMessage('Formato de email no permitido').run(req)

    let resultado = validationResult(req) // crea un array e los errores que arrojan las aldaciones anteriores

    if(!resultado.isEmpty()) {
        return res.render('auth/olvide_password', {
               pagina: "Recupera tu Password",
               csrfToken: req.csrfToken(),
               errores: resultado.array(),
               usuario: {
                    email: req.body.email
                }
        })
    }
    
    // buscar el usuario para verificar

    const { email } = req.body

    const usuario = await Usuario.findOne({ where: { email: email} })

    if (!usuario) {
        return res.render('auth/olvide_password',{
            pagina: "Recupera tu acceso a BienesRaices.com",
            mensaje: "Este email no se encuntra Registrado",
            csrfToken: req.csrfToken(),
            error: true
        })
    }

    // Generar token y guardarlo en el registro del usuario
    usuario.token = generarId()
    await usuario.save()

    // Enviar un Email de recuperacion
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    // Mostrar mensaje de confirmacion
    res.render('templates/mensaje', {
        pagina: 'Recupera tu Password',
        mensaje: 'Hemos Enviado un Email con un enlace de Confirmación, presiona en el Enlace'
    })

}

// comprueba token enviado al email y muestra formulario de cambio de password
const comprobarToken = async(req, res) => {
   const { token } = req.params 

   // revizar que el token es de un usuario registrado
   const usuario = await Usuario.findOne({ where: { token: token} })

   // si no hay usuario registrado muestra mensaje de error
    if (!usuario) {
        return res.render('auth/confirmar_cuenta',{
            pagina: "Recupera tu acceso a BienesRaices.com",
            mensaje: "Hubo un error al validar tu informacion, intenta de nuevo",
            error: true
        })
    }

    // si exste usuario Mostrar formulario para modificar la password
    res.render('auth/reset_password',{
        csrfToken: req.csrfToken(),
        pagina: "Recupera tu password"
    })
}

// valida password y hace los cambios de password en la base de datos
const nuevoPassword = async(req, res) => {

    // validar password minimo 6 caracteres, y que sean iguales
    await check('password').isLength({ min:6}).withMessage('minimo 6 caracteres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('las Password no coinciden').run(req)

    let resultado = validationResult(req) // crea array de errores

    // si hay errores los renderiza en el formulario
    if(!resultado.isEmpty()) {
        return res.render('auth/reset_password', {
            csrfToken: req.csrfToken(),
            pagina: "Recupera tu password",
            errores: resultado.array(),
               
        })
    }

    // trae el token del front y la password para guardarla en la base de datos
    const { token } = req.params
    const { password } = req.body

    // localiza el usuario con el token
    const usuario = await Usuario.findOne({ where: { token }})

    // hashea nuevamente la password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash( password, salt );

    // borra el token para segridad de la cuenta
    usuario.token = null
    await usuario.save()

    // al salir satisfactorio el cambio muestra el mensaje
    res.render('auth/confirmar_cuenta',{
        pagina: "Password restablesido Correctamente",
        mensaje: "El password se guardó correctamente"
    })
}

export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvideRegistro,
    resetPassword,
    comprobarToken,
    nuevoPassword
    
}