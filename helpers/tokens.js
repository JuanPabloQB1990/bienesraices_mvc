import jwt from 'jsonwebtoken'

// generar jsonwebtoken
const generarJWT = (datos) => jwt.sign({ id: datos.id, nombre: datos.nombre }, process.env.JWT_SECRET, { expiresIn: '1d' })

// genera token para registro y creacion de usuario 
const generarId = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

export {
    generarId,
    generarJWT
}