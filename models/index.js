const Categoria = require('./categoria');
const Producto  = require('./producto');
const Role      = require('./role');
const Server    = require('./server');
const Usuario   = require('./usuario');

// Exportar todos los modelos que brindan los archivos anteriores
module.exports = {
    Categoria,
    Producto,
    Role,  
    Server,
    Usuario
}  