import nodemailer from 'nodemailer' // se requiere instalar npm i nodemailer
import dotenv from 'dotenv' // npm i dotenv

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const { email, nombre, token } = datos

      // Enviar el email
      await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu cuenta en BienesRaices.com',
        text: 'Confirma tu Cuenta en BienesRaices.com',
        html: `<p>Hola ${nombre}, compureba tu cuenta en BienesRaices.com</p>
        <p>Tu cuenta yaesta lista, solo debes confirmarla haciendo click en el siguiente enlace: 
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 5000}/auth/confirmar/${token}">Confirmar Cuenta</a></p>

        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        ` 
      })
}

const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const { email, nombre, token } = datos

      // Enviar el email
      await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Recupera tu password en BienesRaices.com',
        text: 'Recupera tu password en BienesRaices.com',
        html: `<p>Hola ${nombre}, has solicitado recuperar tu password en BienesRaices.com</p>
        <p>Genera una nueva password haciendo click en el siguiente enlace: 
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 5000}/auth/olvide_password/${token}">Recuperar Password</a></p>

        <p>Si tu no scitaste el cambio de password, puedes ignorar este mensaje</p>
        ` 
      })
}

export {
    emailRegistro,
    emailOlvidePassword
}