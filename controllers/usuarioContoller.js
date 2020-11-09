const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {
  const desde = Number(req.query.desde) || 0;
  const [usuarios, total] = await Promise.all([
    Usuario
      .find({}, 'nombre email role google img')
      .skip(desde)
      .limit(5),
    Usuario.countDocuments()
  ]);
  res.json({
    ok: true,
    usuarios,
    total
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
    //Si es usuario de google no puede  actualizar el campo email
    if (!usuarioDB.google) {
      campos.email = email;
    } else if (usuarioDB.email !== email) {
      return res.status(400).json({
        ok: false,
        message: 'Los usuarios de google no pueden actualizar el email'
      });
    }
    //actualizaciones 
    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

    res.json({
      ok: true,
      message: 'Usuario actualizado éxitosamente',
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