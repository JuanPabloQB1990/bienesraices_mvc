import { Dropzone } from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')


Dropzone.options.imagen = {
    dictDefaultMessage: 'Haz click aqui para subir tus imagenes',
    acceptedFiles: '.png, .jpg, .jpeg',
    maxFilesize: 5, // tamaño de imagenes a cargar 5Mb
    maxFiles: 1, // capacidad de archivos a cargar
    parallelelUploads: 1,
    autoProcessQueue: false, // solo se carga la imagen al servidor al presionar boton de cargar
    addRemoveLinks: true, // link para quitar foto cargada
    dictRemoveFile: 'Borrar Archivo', // avizo del link
    dictMaxFilesExceeded: 'El limite de imagenes es solo una', // avizo de limite de archivos
    headers: {
        'CSRF-Token': token // pasar el token al formulario de imagen
    },
    paramName: 'imagen',
    init: function(){
        const dropzone = this
        const btnPublicar = document.querySelector('#publicar')

        btnPublicar.addEventListener('click', function(){
            dropzone.processQueue()
        })

        dropzone.on('queuecomplete', function(){
            if(dropzone.getActiveFiles().length == 0) {
                window.location.href = '/mis-propiedades'
            }
        })
    }
}