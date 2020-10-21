const { Schema, model } = require('mongoose');


const MedicoSchema = new Schema({
  //!mdbgum

  nombre: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  hospital: {
    type: Schema.Types.ObjectId,
    ref: "Hospital"
  }

});

//Funcion que permite filtrar los datos a mostrar del usuario
MedicoSchema.method('toJSON', function () {
  const { __v, ...object } = this.toObject();

  return object;
});


//Export the model
module.exports = model('Medico', MedicoSchema);