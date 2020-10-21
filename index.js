require('dotenv').config();
const express = require('express');
const { dbConection } = require('./database/config');
const cors = require('cors');

//Crear el servidor de express
const app = express();


//Configurar cors
app.use(cors());
//lectura del body y pase
app.use(express.json());

//DB
dbConection();

//Directorio publico
app.use(express.static('public'));


//Rutas
app.use('/api/v1/usuarios', require('./routes/usuarios'));
app.use('/api/v1/login', require('./routes/auth'));
app.use('/api/v1/hospitales', require('./routes/hospitales'));
app.use('/api/v1/medicos', require('./routes/medicos'));
app.use('/api/v1/todo', require('./routes/busqueda'));
app.use('/api/v1/upload', require('./routes/upload'));
app.listen(process.env.PORT, () => console.log(`Servidor corriendo en el puerto` + process.env.PORT));