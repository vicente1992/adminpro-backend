const { response, request } = require('express');
const Hospital = require('../models/hospital');
const getHospitales = async (req, res = response) => {
  /**
   * populate Sirve para traer los datos del usuairo
   *  y  los datos del hospital
   */
  const hospitales = await Hospital.find().populate('usuario', 'nombre img');
  res.json({
    ok: true,
    hospitales
  });
}
const crearHospital = async (req = request, res = response) => {
  const uid = req.uid;
  const hospital = new Hospital({ usuario: uid, ...req.body });

  try {
    const usuarioDB = await hospital.save();
    res.json({
      ok: true,
      hospital: usuarioDB
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      messahe: "Error inesperado..."
    });
  }
}

const actualizarHospital = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const hospital = await Hospital.findById(id);
    if (!hospital) {
      return res.status(404).json({
        ok: false,
        msg: `No existe hospita  con el id ${id}`
      });
    }

    const cambioHospital = {
      ...req.body,
      usuario: uid
    }
    const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambioHospital, { new: true });
    res.json({
      ok: true,
      hospital: hospitalActualizado
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error
    });
  }
}
const borrarHospital = async (req, res = response) => {
  const id = req.params.id;
  try {
    const hospital = await Hospital.findById(id);
    if (!hospital) {
      return res.status(404).json({
        ok: false,
        msg: `No existe hospita  con el id ${id}`
      });
    }
    await Hospital.findByIdAndDelete(id);
    res.json({
      ok: true,
      message: "Hospital eliminado"
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error
    });
  }
}

module.exports = {
  getHospitales,
  crearHospital,
  actualizarHospital,
  borrarHospital
}