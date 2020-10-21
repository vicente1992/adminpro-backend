const { Schema, model } = require('mongoose');


const HospitalSchema = new Schema({
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
    required: true,
  }

}, { collection: 'hopitales' });

//Funcion que permite filtrar los datos a mostrar del usuario
HospitalSchema.method('toJSON', function () {
  const { __v, ...object } = this.toObject();

  return object;
});


//Export the model
module.exports = model('Hospital', HospitalSchema);