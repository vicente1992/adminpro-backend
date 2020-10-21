const { Schema, model } = require('mongoose');

const UsuarioSchema = new Schema({
  //!mdbgum

  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  img: {
    type: String,

  },
  role: {
    type: String,
    required: true,
    default: "USER_ROLE"
  },
  google: {
    type: Boolean,
    default: false
  }


});

//Funcion que permite filtrar los datos a mostrar del usuario
UsuarioSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.uid = _id;
  return object;
});


//Export the model
module.exports = model('Usuario', UsuarioSchema);