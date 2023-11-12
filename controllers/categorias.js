const { response } = require("express");
const { Categoria } = require('../models');

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req, res = response) => {

   // const { q, nombre='no name', apikey, page=1, limit} = req.query;
   const {limite = 5, desde = 0} = req.query;
   const conditionsQuery = { estado : true };

   // const categorias = await Categoria.find(conditionsQuery)
   //     .skip(desde)
   //     .limit(limite);

   // const total = await Categoria.countDocuments(conditionsQuery);

   const [total, categorias] = await Promise.all([
        Categoria.countDocuments(conditionsQuery),
        Categoria.find(conditionsQuery)
            .populate('usuario', 'nombre')
            .skip(desde)
            .limit(limite)
   ]);


   res.json({
       total,
       categorias
   });
}

// obtenerCategoria - populate
const obtenerCategoria = async (req, res = response) => {

    const {id} = req.params;
    const categoria = await Categoria.findById(id)
        .populate('usuario', 'nombre');

    res.json(categoria);
}

const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if (categoriaDB) {
        return res.status(400).json({
            msg : `La categoría ${categoriaDB.nombre}, ya existe.`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario : req.usuario._id
    }

    const categoria = new Categoria(data);

    //Guardar en DB
    await categoria.save();

    res.status(201).json(categoria);
}

// actualizarCategoría
const actualizarCategoria = async (req, res = response) => {

    const { id } = req.params;
    const {estado, usuario, ...data} = req.body;

    data.nombre  = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    // findByIdAndUpdate Deprecated: se debe usar { new: true }).exec() para que funcione.
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new : true}).exec();
    
    res.json(categoria);

}

// borrarCategoría - estado : false
const borrarCategoria = async (req, res = response) => {

    const { id } = req.params;

    // findByIdAndUpdate Deprecated: se debe usar { new: true }).exec() para que funcione.
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado : false}, { new : true}).exec();
    
    res.json(categoriaBorrada);

}


module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}