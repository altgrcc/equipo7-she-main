// routes/login.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const router = express.Router();

// Clave secreta para firmar tokens (guárdala en tu .env en producción)
const JWT_SECRET = 'clave-secreta-super-importante';

router.post('/', async (req, res) => {
  const { matricula, password } = req.body;

  try {
    await sql.connect({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      server: '127.0.0.1',
      database: process.env.DATABASE,
      port: Number(process.env.PORT),
      options: {
        trustServerCertificate: true,
        enableArithAbort: true,
      }
    });

    const result = await sql.query`
      SELECT * FROM usuarios WHERE matricula = ${matricula}
    `;

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const usuario = result.recordset[0];
    const passwordCorrecta = await bcrypt.compare(password, usuario.password);

    if (!passwordCorrecta) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      {
        matricula: usuario.matricula,
        rol: usuario.rol,
        nombre: usuario.nombre,
      },
      JWT_SECRET,
      { expiresIn: '4h' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        matricula: usuario.matricula,
        nombre: usuario.nombre,
        rol: usuario.rol,
      }
    });

  } catch (error) {
    console.error('Error en /login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
