
/**
 * Ruta: /api/v1/usuarios
 */
const { Router } = require('express');
const { check } = require('express-validator');
const {
  getUsuarios, CrearUsuarios,
  actualizarUsuario, borrarUsuario
} = require('../controllers/usuarioContoller');
const { validarCampos } = require('../middlewares/validar-campos');
const {
  validarJWT,
  validarADMIN_ROLE,
  validarADMIN_ROLE_o_MismoUsuario
} = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getUsuarios);

router.post('/', [

  check('nombre', 'EL nombre es obligatorio').not().isEmpty(),
  check('password', 'EL password es obligatorio').not().isEmpty(),
  check('email', 'EL email es obligatorio').isEmail(),
  validarCampos
], CrearUsuarios);

router.put('/:id', [
  validarJWT,
  validarADMIN_ROLE_o_MismoUsuario,
  check('nombre', 'EL nombre es obligatorio').not().isEmpty(),
  check('email', 'EL email es obligatorio').isEmail(),
  check('role', 'EL rol es obligatorio').not().isEmpty(),
  validarCampos
], actualizarUsuario);


router.delete('/:id', [validarJWT, validarADMIN_ROLE,], borrarUsuario);
module.exports = router;