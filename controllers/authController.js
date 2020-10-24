const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    //Verificar email
    const usuarioDB = await Usuario.findOne({ email });
    if (!usuarioDB) {
      res.status(404).json({
        ok: false,
        message: 'Email o Contraseña no valido'
      })
    }
    //Verificar contraseña
    const validPasword = bcrypt.compareSync(password, usuarioDB.password);
    if (!validPasword) {
      res.status(400).json({
        ok: false,
        message: 'Email o Contraseña no valido'
      })
    }
    //Generar un token
    const token = await generarJWT(usuarioDB._id);
    res.json({
      ok: true,
      token
    })

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error inesperado...'
    })
  }
}
const googleSignIn = async (req, res = response) => {

  const googleToken = req.body.token;


  try {
    const { name, email, picture } = await googleVerify(googleToken);

    //verificar si exite un usuario con ese email
    const usuarioDB = await Usuario.findOne({ email });
    let usuario;
    if (!usuarioDB) {
      //Si no existe el usuario          
      usuario = new Usuario({
        nombre: name,
        email,
        password: '@@@',
        img: picture,
        google: true
      });

    } else {
      //Exite usuario
      usuario = usuarioDB;
      usuario.google = true;
    }


    await usuario.save();
    // Generar el TOKEN - JWT
    const token = await generarJWT(usuario.id);
    res.json({
      ok: true,
      token
    });
  } catch (error) {
    res.status(401).json({
      ok: false,
      msg: 'El token no es correcto',
      error
    });
  }
}
const renewToken = async (req, res = response) => {
  const uid = req.uid;
  // Generar el TOKEN - JWT
  const token = await generarJWT(uid);

  //Obtener usuario por id
  const usuario = await Usuario.findById(uid);

  res.json({
    ok: true,
    token,
    usuario
  });
}

module.exports = {
  login,
  googleSignIn,
  renewToken
}