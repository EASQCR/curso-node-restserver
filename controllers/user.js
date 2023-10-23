const {response, request} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async(req= request, res = response) => {

    // const { q, nombre='no name', apikey, page=1, limit} = req.query;
    const {limite = 5, desde = 0} = req.query;
    const conditionsQuery = { estado : true };

    // const usuarios = await Usuario.find(conditionsQuery)
    //     .skip(desde)
    //     .limit(limite);

    // const total = await Usuario.countDocuments(conditionsQuery);

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(conditionsQuery),
        Usuario.find(conditionsQuery)
            .skip(desde)
            .limit(limite)
    ]);


    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res = response) => {

    const {nombre, correo, password, rol} = req.body;

    const usuario = new Usuario({nombre, correo, password, rol});

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(); // Por defecto es 10 => bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guarda en BD
    await usuario.save();
    
    res.json({
        usuario
    });
}

const usuariosPut = async(req, res = response) => {

    const {id} = req.params;
    const { _id, password, google, ...resto } = req.body; // trae en resto los campos menos password y google

    // Validar contra base de datos
    if (password) {
        // Encriptar la contraseña
        const salt     = bcryptjs.genSaltSync(); // Por defecto es 10 => bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync(password, salt);
    }

    // findByIdAndUpdate Deprecated: se debe usar { new: true }).exec() para que funcione.
    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true }).exec(); 
    
    res.json(usuario);
}

const usuariosDelete = async(req, res = response) => {
    
    const { id } = req.params;

    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete(id);

    // Marcando el registro como borrado (estado = false)
    const usuario = await Usuario.findByIdAndUpdate(id, {estado : false});

    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {
    
    res.json({
        msg : 'patch API - usuariosPatch'
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
}