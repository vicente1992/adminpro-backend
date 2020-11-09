/*
    ruta: api/todo/
*/
const { Router } = require('express');
const { getTodo, getDocumentosColeccion } = require('../controllers/busquedaController');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


router.get('/:busqueda', validarJWT, getTodo);

router.get('/coleccion/:tabla/:busqueda', validarJWT, getTodo);



module.exports = router;