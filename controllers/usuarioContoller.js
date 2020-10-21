const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {

  const usuario = await Usuario.find({}, 'nombre email role google img');
  res.json({
    ok: true,
    usuario,
    uid: req.uid //Muestra el uid del usuaio que realiza la petición
  })
}
const CrearUsuarios = async (req, res = response) => {
  const { email, password } = req.body;

  try {

    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      res.status(400).json({
        ok: false,
        message: 'El email ya  esta registrado...'
      });
    }
    const usuario = new Usuario(req.body);

    //Encryptar Contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    //Guardar usuario
    await usuario.save();

    //Generar un token
    const token = await generarJWT(usuario._id);

    res.json({
      ok: true,
      usuario,
      token
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error inesperado...'
    })
  }
}
const actualizarUsuario = async (req, res = response) => {
  //TODO: validar token y comprovar si el usario es correcto
  const uid = req.params.id;



  try {

    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      res.status(404).json({
        ok: false,
        message: 'No exiten ningun usuario por ese id'
      })
    }

    const { password, google, email, ...campos } = req.body;

    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        res.status(400).json({
          ok: false,
          message: 'Ya existe un usuario con ese email'
        });
      }
    }
    //actualizaciones 
    campos.email = email;
    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

    res.json({
      ok: true,
      usuario: usuarioActualizado
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error inesperado...'
    });

  }
}

const borrarUsuario = async (req = request, res = response) => {
  const uid = req.params.id;
  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      res.status(404).json({
        ok: false,
        message: 'No exiten ningun usuario por ese id'
      })
    }
    await Usuario.findByIdAndRemove(uid);
    res.json({
      ok: true,
      message: 'Usuario eliminado'
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error inesperado...'
    });
  }
}
module.exports = {
  getUsuarios,
  CrearUsuarios,
  actualizarUsuario,
  borrarUsuario
}