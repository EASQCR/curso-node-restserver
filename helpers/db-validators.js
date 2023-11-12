const { Role, Usuario, Categoria, Producto }    = require('../models');

/***
 * Roles
 */
const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({rol});
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
}

/***
 * Usuarios
 */
const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({correo});
    if (existeEmail) {
        throw new Error(`El correo: ${correo} ya está registrado.`);
    } 
}

const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id: ${id} no existe.`);
    } 
}

/***
 * Categorías
 */
const existeCategoriaById = async (id) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`La categoría: ${id} no existe.`);
    } 
}

/***
 * Productos
 */
const existeProductoById = async (id) => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`La producto: ${id} no existe.`);
    } 
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaById,
    existeProductoById
}