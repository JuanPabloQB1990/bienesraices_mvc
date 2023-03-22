import multer from 'multer' // npm i multer , para guardar imagenes en el servidor
import path from 'path'
import { generarId } from '../helpers/tokens.js'
 
const storage = multer.diskStorage({
    destination: function(req, file, cb) { //  destino a guardar del archivo
        cb(null, './public/uploads/') // carpeta donde ira a cargar el archivo
    },
    filename: function(req, file, cb){
        cb(null, generarId() + path.extname(file.originalname)) // nombre del archivo irrepetible a guardar
    }
})

const upload = multer({ storage })

export default upload