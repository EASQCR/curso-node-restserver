const {Schema, model} = require('mongoose');

const RoleSchema = Schema({
    rol : {
        type : String,
        requires : [true, 'El Rol es obligatorio.']
    }
});


module.exports = model('Role', RoleSchema);


