const { response, request } = require('express');
const Medico = require('../models/medico');

const getMedicos = async (req, res = response) => {

  const medicos = await Medico.find()
    .populate('usuario', 'nombre img')
    .populate('hospital', 'nombre img')
  res.json({
    ok: true,
    medicos
  })
}
const getMedico = async (req, res = response) => {
  const { id } = req.params;
  const medico = await Medico.findById(id);
  if (!medico) {
    res.status(400).json({
      ok: false,
      message: `No se encontra un médico con el id ${id}.`
    });
  }
  res.json({
    ok: true,
    medico
  })

}
const crearMedico = async (req, res = response) => {

  const uid = req.uid;
  const medico = new Medico({
    usuario: uid,
    ...req.body
  });

  try {
    const medicoDB = await medico.save();
    res.json({
      ok: true,
      medico: medicoDB
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error inesperado..."
    });
  }

}

const actualizarMedico = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;
  console.log({ uid });
  try {
    const medico = await Medico.findById(id);
    if (!medico) {
      return res.status(404).json({
        ok: false,
        msg: `No existe medico  con el id ${id}`
      });
    }

    const cambioMedico = {
      ...req.body,
      usuario: uid
    }
    const medicoActualizado = await Medico.findByIdAndUpdate(id, cambioMedico, { new: true });
    res.json({
      ok: true,
      medico: medicoActualizado
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
      error
    });
  }
}
const borrarMedico = async (req, res = response) => {
  const id = req.params.id;

  try {
    const medico = await Medico.findById(id);
    if (!medico) {
      return res.status(404).json({
        ok: false,
        msg: `No existe medico  con el id ${id}`
      });
    }
    await Medico.findByIdAndDelete(id);

    res.json({
      ok: true,
      message: "Medico eliminado"
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
  getMedicos,
  getMedico,
  crearMedico,
  actualizarMedico,
  borrarMedico
}