
const {Schema, model} = require('mongoose');
//const { usuariosDelete } = require('../controllers/user');

const UsuarioSchema = Schema({
    nombre : {
        type : String,
        required : [true, 'El nombre es obligatorio']
    },
    correo : {
        type : String,
        requires : [true, 'El correo es obligatorio'],
        unique : true
    },
    password : {
        type : String,
        requires : [true, 'El password es obligatorio']
    },
    img : {
        type : String
    },
    rol : {
        type : String,
        requires : true,
        enum : ['ADMIN_ROLE', 'USER_ROLE'],
        default : 'USER_ROLE'
    },
    estado : {
        type : Boolean,
        default : true
    },
    google : {
        type : Boolean,
        default : false
    }
});

UsuarioSchema.methods.toJSON = function() { // OJO funcion normal no =>
    const {__v, password, _id, ...usuario} = this.toObject();
    
    // convierto el _id como uid en el usuario
    usuario.uid = _id;
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);

