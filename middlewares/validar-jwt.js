const { response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(402).json({
            msg : 'No hay token en la petición.'
        });
    }
    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // Leer el usuario correspondiente al uid
        const usuario = await Usuario.findById(uid);

        // Validar que el usuario exista
        if (!usuario) {
            return res.status(401).json({
                msg : 'Token no válido - usuario no existe en BD.'
            })
        }

        // Validar que el usuario no está eliminado (estado : true)
        if (!usuario.estado) {
            return res.status(401).json({
                msg : 'Token no válido - usuario estado : false.'
            })
        }

        req.usuario = usuario;
        next();

    } catch(error) {
        console.log(error);
        res.status(402).json({
            msg : 'Token no válido.'
        });

    }
}

module.exports = {
    validarJWT
}