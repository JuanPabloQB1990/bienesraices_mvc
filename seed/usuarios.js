import bcrypt from 'bcrypt'


const usuarios = [
    {
        nombre: "Juan",
        email: "juanpabloqb1990@gmail.com",
        confirmado: 1,
        password: bcrypt.hashSync('password', 10)
    }
]

export default usuarios