require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Los directorios de uploads deben existir en la siguiente estructura:
// ../uploads/
//   ├── academico/
//   ├── deportivo/
//   ├── cultural/
//   ├── laboratoristas/
//   ├── tutoreo/

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Traductor a JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); 

const deportivoRoutes = require('./routes/deportivo');
app.use('/deportivo', deportivoRoutes);

const culturalRoutes = require('./routes/cultural');
app.use('/cultural', culturalRoutes);

const academicoRoutes = require('./routes/academico');
app.use('/academico', academicoRoutes);

const laboratoristasRoutes = require('./routes/laboratoristas');
app.use('/laboratoristas', laboratoristasRoutes);

const tutoreoRoutes = require('./routes/tutoreo');
app.use('/tutoreo', tutoreoRoutes);

// Se inicia el server
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
