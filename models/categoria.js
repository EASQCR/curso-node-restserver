const {Schema, model} = require('mongoose');

const CategoriaSchema = Schema({
    nombre : {
        type     : String,
        required : [true, 'El nombre es obligatorio.']
    },
    estado : {
        type     : Boolean,
        default  : true,
        required : true
    },
    usuario : {
        type     : Schema.Types.ObjectId,
        ref      : 'Usuario',  // Referencia al tipo Usuario
        required : true
    }
});

CategoriaSchema.methods.toJSON = function() { // OJO funcion normal no =>
    const {__v, estado, ...data} = this.toObject();
    return data;
}

module.exports = model('Categoria', CategoriaSchema);


