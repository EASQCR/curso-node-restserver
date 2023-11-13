const jwt = require('jsonwebtoken');

const generarJWT = (uid = '') => {

    //uid = Identificador Único del Usuario

    // Se debe codificar como una promesa para poder usar await
    return new Promise((resolve, reject) => {

        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn : '4h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token.');
            } else {
                resolve(token);
            }
        });
    });
}

module.exports = {
    generarJWT
}