const jwt = require('jsonwebtoken');
const validarJWT = (req, res, next) => {

  //Leer el token
  const token = req.header('x-token')

  if (!token) {
    res.status(401).json({
      ok: false,
      message: 'No hay token en la petición'
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    req.uid = uid;
    next();

  } catch (error) {
    res.status(401).json({
      ok: false,
      message: 'Token incorrecto'
    });
  }

}

module.exports = {
  validarJWT
}