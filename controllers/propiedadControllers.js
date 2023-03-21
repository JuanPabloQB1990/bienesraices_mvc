import { Propiedad, Precio, Categoria } from '../models/index.js'
import { validationResult } from 'express-validator'


const admin = async(req, res) => {

    const { id } = req.usuario // se exrae el id del objeto que nos da la ruta protegida 

    // se filtra las propiedades que tengan el id del usuario logeado
    const propiedades = await Propiedad.findAll({ 
        where: { 
            usuarioId: id 
        }, 
        // include: innerJoin en mysql relaciona los datos con una tabla
        include: [
                { model: Categoria, as: 'categoria'},
                { model: Precio, as: 'precio'}

            ]
        
    })

    res.render('propiedades/admin', {
        pagina: "Mis Propiedades",
        propiedades
    }) 
}

// FORMULARIO PARA CREAR PROPIEDAD
const crear = async(req, res) => {
    // consultar modelo de precios y categorias de forma asincrona con Promise.all
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/crear', {
        pagina: "Crear Propiedad",
        categorias,
        csrfToken: req.csrfToken(),
        precios,
        datos: {}
    }) 
}

// funcio guardar Propiedad en la base de datos
const guardarPropiedad = async(req, res) => {

    // validar campos de formulario crear propiedades 
    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

        // se consulta de nuevo a la base de datos para pasar de nuevo los registros de las tablas
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])

        // se renderiza formulario con los errores
        return res.render('propiedades/crear', {
            pagina: "Crear Propiedad",
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores : resultado.array(),
            datos: req.body

        }) 
    }

    // crear registro de propiedades
    const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, categoria: categoriaId, precio: precioId } = req.body
    const { id: usuarioId } = req.usuario
    
    try {
        const propiedadGuardada = await Propiedad.create({
            titulo, 
            descripcion, 
            habitaciones, 
            estacionamiento, 
            wc, 
            calle, 
            lat, 
            lng,
            imagen: '',
            precioId,
            categoriaId,
            usuarioId
        })

        const { id } = propiedadGuardada

        res.redirect(`/propiedades/agregar-imagenes/${id}`)

    } catch (error) {
        console.log(error);
    }
}



const agregarImagen = async(req, res) => {
    
    const { id } = req.params

    // validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    //validar que la propiedad no este publicada
    if (propiedad.publicado) {
        return res.redirect('/mis-propiedades')
    }

    //validar que la propiedad pertenece a quien visita la pagina
    if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades')
    }

    res.render("propiedades/agregar-imagen",{ 
        pagina: `Agregale una Imagen a la ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        propiedad
    })
}

const almacenarImagen = async(req, res, next) => {
    
    const { id } = req.params

    // validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    //validar que la propiedad no este publicada
    if (propiedad.publicado) {
        return res.redirect('/mis-propiedades')
    }

    //validar que la propiedad pertenece a quien visita la pagina
    if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades')
    }

    try {
        console.log(req.file);
        // almacenar la imagen y publicar propiedad
        propiedad.imagen = req.file.filename
        propiedad.publicado = 1
        await propiedad.save()
        next()
    } catch (error) {
        console.log(error);
    }
}

export {
    admin,
    crear,
    guardarPropiedad,
    agregarImagen,
    almacenarImagen
}