const {Router}  = require('express');
const { check } = require('express-validator');

const { validarJWT, validaCampos, esAdminRole } = require('../middlewares');
const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategoria, 
        borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaById } = require('../helpers/db-validators');

const router = Router();

/***
 * {{url}}/api/categorias
 */

// Obtener todas las categorías - público
router.get('/', obtenerCategorias);

// Obtener una categoría por id - público
router.get('/:id', [
    check('id', 'No es un id de Mongo válido.').isMongoId(),
    check('id').custom(existeCategoriaById),
    validaCampos
], obtenerCategoria);

// Crear categoría - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre',  'El nombre es obligatorio.').not().notEmpty(),
    validaCampos
], crearCategoria);

// Actualizar una categoría - privado - cualquier persona con un token válido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
    check('id').custom(existeCategoriaById),
    validaCampos
], actualizarCategoria);

// Borrar una categoría - privado - sólo Admin (cambiar estado)
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido.').isMongoId(),
    check('id').custom(existeCategoriaById),
    validaCampos
], borrarCategoria);


module.exports = router;
