const {response} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el email existe.
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg : 'Usuario / Password no son correctos - correo'
            });
        }

        // Verificar si el usuario está activo en la BD.
        if (!usuario.estado) {
            return res.status(400).json({
                msg : 'Usuario / Password no son correctos - estado : false'
            });
        }

        // Verificar la contraseña.
        const validarPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validarPassword) {
            return res.status(400).json({
                msg : 'Usuario / Password no son correctos - password'
            });
        }


        // Generar el JWT (JSON Web Token).
        // Se instala el nmp i jsonwebtoken
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })   
             
    } catch {
        console.log(error);
        res.status(500).json({
            msg : "Hable con el administrador."
        })
    }
}

const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body;
   // console.log(id_token);

    try {
        const { correo, nombre, img } = await googleVerify(id_token);
    
        // Generar referencia para validar si existe el usuario
        let usuario = await Usuario.findOne( {correo} );

        if (!usuario) {
            // Tengo que crear el usuario
            const data = {
                nombre,
                correo,
                password : ':P',
                img,
                google : true
            }

            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario en BD tiene estado = false
        if (!usuario.estado) {
            return res.status(401).json({
                msg : 'Hable cone el administrador, usuario bloqueado.'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            ok :  false,
            msg : 'El Token no se pudo verificar.'
        })
    }
}


module.exports = {
    login,
    googleSignIn 
}