const validaCampos = require('../middlewares/validar-campos');
const validarJWT   = require('../middlewares/validar-jwt');
const validaRoles  = require('../middlewares/validar-roles');

// Exportar todas las funciones que brindan los archivos anteriores
module.exports = {
    ...validaCampos,
    ...validarJWT,  
    ...validaRoles
}