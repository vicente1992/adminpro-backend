/**
 * Ruta: /api/v1/hospitales
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const {
  getHospitales,
  crearHospital,
  actualizarHospital,
  borrarHospital
} = require('../controllers/hospitalesController')

const router = Router();

router.get('/', getHospitales);

router.post('/', validarJWT,
  [
    check('nombre', 'El nombre el hospital es obligatorio').not().isEmpty(),
    validarCampos
  ], crearHospital);

router.put('/:id',
  validarJWT,
  [
    check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
  ], actualizarHospital);

router.delete('/:id', validarJWT, borrarHospital);
module.exports = router;