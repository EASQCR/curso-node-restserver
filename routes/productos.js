const {Router}  = require('express');
const { check } = require('express-validator');

const { validarJWT, validaCampos, esAdminRole } = require('../middlewares');
const { crearProducto, 
        obtenerProductos, 
        obtenerProducto, 
        actualizarProducto, 
        borrarProducto } = require('../controllers/productos');
const { existeCategoriaById,
        existeProductoById } = require('../helpers/db-validators');

const router = Router();

/***
 * {{url}}/api/productos
 */

// Obtener todas las productos - público
router.get('/', obtenerProductos);

// Obtener un producto por id - público
router.get('/:id', [
    check('id', 'No es un id de Mongo válido.').isMongoId(),
    check('id').custom(existeProductoById),
    validaCampos
], obtenerProducto);

// Crear producto - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre',    'El nombre es obligatorio.').not().notEmpty(),
    check('categoria', 'No es un id de Mongo válido.').isMongoId(),
    check('categoria').custom(existeCategoriaById),
    validaCampos
], crearProducto);

// Actualizar una producto - privado - cualquier persona con un token válido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo válido.').isMongoId(),
    check('id').custom(existeProductoById),
    validaCampos
], actualizarProducto);

// Borrar un producto - privado - sólo Admin (cambiar estado)
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido.').isMongoId(),
    check('id').custom(existeProductoById),
    validaCampos
], borrarProducto);


module.exports = router;
