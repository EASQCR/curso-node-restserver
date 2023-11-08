const {Router}  = require('express');
const { check } = require('express-validator');

const { validaCampos } = require('../middlewares/validar-campos');

const { login, googleSignIn } = require('../controllers/auth');

const router = Router();

router.post('/login',[
    check('correo', 'El correo es obligatorio.').isEmail(),
    check('password', 'La contraseña es obligatoria.').not().isEmpty(),
    validaCampos
], login);        

router.post('/google',[
    check('id_token', 'id_token de Google es necesario.').not().isEmpty(),
    validaCampos
], googleSignIn);    

module.exports = router;
