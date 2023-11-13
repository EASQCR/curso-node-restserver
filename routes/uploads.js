const {Router}  = require('express');
const { check } = require('express-validator');

const { validaCampos, validarArchivoSubir }  = require('../middlewares');
const { cargarArchivo, 
        actualizarImagen,
        mostrarImagen, 
        actualizarImagenCloudinary} = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');


const router = Router();

// Cargar un archivo nuevo
router.post('/', validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validaCampos,
], actualizarImagenCloudinary);
// ], actualizarImagen);

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validaCampos,
], mostrarImagen)

module.exports = router;
