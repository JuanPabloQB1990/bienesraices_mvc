import { DataTypes } from "sequelize"; // npm i sequelize
import db from '../config/db.js'
import bcrypt from 'bcrypt' // npm i bcrypt

const Usuario = db.define('usuarios', { // crea la tabla usuarios en la base de datos bienesraices
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
}, 
{
    hooks: {
        beforeCreate: async function(usuario) { // antes de crear el registro hashea la password
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password, salt);
        }
    },

    // elimina los siguientes campos en las consultas hacia la base de datos
    scopes: {
        eliminarPassword: {
            attributes: {
                exclude: ['password','token', 'confirmado', 'createdAt', 'updateAt']
            }
        }
    }
})

// comparar password que envia el front con la de la base de datos
Usuario.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

export default Usuario;