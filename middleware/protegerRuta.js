import jwt from 'jsonwebtoken' // npm i jsonwebtoken
import Usuario  from '../models/Usuario.js'

const protegerRuta = async (req, res, next) => {

    // verificar si hay un token
    const { token } = req.cookies

    if (!token) {
        return res.redirect('/auth/login')
    }

    // comprobar jsonwebtoken

    try {
        // verifica que el token sea valido
        const decode = jwt.verify(token, process.env.JWT_SECRET)  // devuelve el array de payload o info de la cookie
        // findByPk => busca un usuario por la llave primaria
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decode.id) // scope ejecuta la funcion de Usuario.eliminarPassword
       

        // almacenar el usuario al req
        if(usuario) {
            req.usuario = usuario
        }else{
            return request.redirect('/auth/login')
        }

        return next()

    } catch (error) {
        return res.clearCookie('token').redirect('/auth/login') // borra la cookie 
    }

}

export default protegerRuta