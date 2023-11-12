const {Router}  = require('express');

const { buscar } = require('../controllers/buscar');

const router = Router();

/***
 * {{url}}/:coleccion/:termino
 */

// Búsqueda por colección
router.get('/:coleccion/:termino', buscar);


module.exports = router;
