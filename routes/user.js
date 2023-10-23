const {Router} = require('express');
const { check } = require('express-validator');

const {validaCampos} = require('../middlewares/validar-campos');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const {usuariosGet, 
       usuariosPost, 
       usuariosPut, 
       usuariosDelete, 
       usuariosPatch} = require('../controllers/user');

const router = Router();

router.get('/', usuariosGet);         

router.put('/:id', [
    // Valida que el ID sea un Mongo ID
    check('id', 'No es un ID válido.').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),  // equivalente a (rol) => esRoleValido(rol)
    validaCampos
], usuariosPut);         

router.post('/', [
    check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
    check('password', 'El password debe ser más de 6 letras.').isLength({min : 6}),
    check('correo', 'El correo no es válido.').isEmail(),
    check('correo').custom(emailExiste),
//    check('rol', 'No es un rol válido.').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRoleValido),  // equivalente a (rol) => esRoleValido(rol)
    validaCampos
], usuariosPost);         

router.delete('/:id', [
    // Valida que el ID sea un Mongo ID
    check('id', 'No es un ID válido.').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validaCampos
], usuariosDelete);         

router.patch('/', usuariosPatch);       


module.exports = router;