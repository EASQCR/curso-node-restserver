const { response } = require("express");
const { Producto } = require('../models');

// obtenerProductos - paginado - total - populate
const obtenerProductos = async (req, res = response) => {

   // const { q, nombre='no name', apikey, page=1, limit} = req.query;
   const {limite = 5, desde = 0} = req.query;
   const conditionsQuery = { estado : true };

   // const productos = await Producto.find(conditionsQuery)
   //     .skip(desde)
   //     .limit(limite);

   // const total = await Producto.countDocuments(conditionsQuery);

   const [total, productos] = await Promise.all([
        Producto.countDocuments(conditionsQuery),
        Producto.find(conditionsQuery)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(desde)
            .limit(limite)
   ]);


   res.json({
       total,
       productos
   });
}

// obtenerProducto - populate
const obtenerProducto = async (req, res = response) => {

    const {id} = req.params;
    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json(producto);
}

const crearProducto = async (req, res = response) => {

    const { estado, usuario, ...body} = req.body;

    const productoDB = await Producto.findOne({nombre : body.nombre});

    if (productoDB) {
        return res.status(400).json({
            msg : `El producto ${productoDB.nombre}, ya existe.`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,  // todo el resto
        nombre : body.nombre.toUpperCase(),
        usuario : req.usuario._id
    }

    const producto = new Producto(data);

    //Guardar en DB
    await producto.save();

    res.status(201).json(producto);
}

// actualizarProducto
const actualizarProducto = async (req, res = response) => {

    const { id } = req.params;
    const {estado, usuario, ...data} = req.body;

    if (data.nombre) {
        data.nombre  = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    // findByIdAndUpdate Deprecated: se debe usar { new: true }).exec() para que funcione.
    const producto = await Producto.findByIdAndUpdate(id, data, { new : true}).exec();
    
    res.json(producto);

}

// borrarProducto - estado : false
const borrarProducto = async (req, res = response) => {

    const { id } = req.params;

    // findByIdAndUpdate Deprecated: se debe usar { new: true }).exec() para que funcione.
    const productoBorrado = await Producto.findByIdAndUpdate(id, {estado : false}, { new : true}).exec();
    
    res.json(productoBorrado);

}


module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}