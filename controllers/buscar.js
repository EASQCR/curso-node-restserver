const { response } = require("express");
const { ObjectId} = require('mongoose').Types;

const { Usuario, Categoria, Producto} = require('../models');

const  coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios'
]

const buscarUsuarios = async ( termino = '', res = response)=> {

    const esMongoID = ObjectId.isValid( termino );  // true or false

    // Si el termino es un id de usuario
    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            // si usuario existe devuelve arreglo con usuario sino arreglo vacío
            results : (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    // Buscar por el termino (nombre ó correo)
    const usuarios = await Usuario.find({ 
        $or  : [ {nombre : regex}, {correo : regex}],
        $and : [ {estado : true} ]  // debe tener estado = true
    });

    res.json({
        // si usuario esxiste devuelve arreglo con usuario sino arreglo vacío
        results : usuarios
    });
}

const buscarCategorias = async ( termino = '', res = response)=> {

    const esMongoID = ObjectId.isValid( termino );  // true or false

    // Si el termino es un id de usuario
    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            // si categoria existe devuelve arreglo con usuario sino arreglo vacío
            results : (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    // Buscar por el termino (nombre ó correo)
    const categorias = await Categoria.find({nombre : regex, estado : true});

    res.json({
        // si usuario esxiste devuelve arreglo con usuario sino arreglo vacío
        results : categorias
    });
}

const buscarProductos = async ( termino = '', res = response)=> {

    const esMongoID = ObjectId.isValid( termino );  // true or false

    // Si el termino es un id de usuario
    if (esMongoID) {
        const producto = await Producto.findById(termino)
           .populate('categoria', 'nombre');

        return res.json({
            // si producto existe devuelve arreglo con usuario sino arreglo vacío
            results : (producto) ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    // Buscar por el termino (nombre ó correo)
    const productos = await Producto.find({ 
        $or  : [ {nombre : regex}, {descripcion : regex}],
        $and : [ {estado : true} ]  // debe tener estado = true
    }).populate('categoria', 'nombre')
      .populate('usuario', 'nombre');

    res.json({
        // si usuario esxiste devuelve arreglo con usuario sino arreglo vacío
        results : productos
    });
}

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg : `Las colecciones permitidas son : ${coleccionesPermitidas}.`
        });
    }

    switch (coleccion) {
        case 'categorias':
            buscarCategorias(termino, res);
        break;
            
        case 'productos' :
            buscarProductos(termino, res);
        break;

        case 'usuarios'  :
            buscarUsuarios(termino, res);
        break;
    
        default:
            res.status(500).json({
                msg : 'Se me olvidó hacer esta búsqueda.'
            })
        break;
    }

}

module.exports = {
    buscar
}