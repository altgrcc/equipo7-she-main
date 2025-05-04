const express = require('express');
const bcrypt = require('bcrypt');
const sql = require('mssql');
const { verificarToken, permitirRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', verificarToken, permitirRoles('Administrador'), async (req, res) => {
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

    const result = await sql.query`SELECT * FROM usuarios`;

    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

router.post('/', verificarToken, permitirRoles('Administrador'), async (req, res) => {
  try {
    const {
      matricula,
      nombre,
      segundo_nombre,
      apellido,
      segundo_apellido,
      correo,
      password,
      rol,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

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
    const resultMatricula = await sql.query`
    SELECT 1 FROM usuarios WHERE matricula = ${matricula}
  `;
  if (resultMatricula.recordset.length > 0) {
    return res.status(400).json({ error: 'La matrícula ya está registrada.' });
  }

  const resultCorreo = await sql.query`
    SELECT 1 FROM usuarios WHERE correo = ${correo}
  `;
  if (resultCorreo.recordset.length > 0) {
    return res.status(400).json({ error: 'El correo ya está registrado.' });
  }

  await sql.query`
    INSERT INTO usuarios (
      matricula, nombre, segundo_nombre, apellido, segundo_apellido,
      correo, password, rol
    )
    VALUES (
      ${matricula}, ${nombre}, ${segundo_nombre || null}, ${apellido}, ${segundo_apellido || null},
      ${correo}, ${hashedPassword}, ${rol}
    )
  `;

  res.status(201).json({ mensaje: 'Usuario creado correctamente' });

} catch (error) {
  if (error.number === 2627) {
    return res.status(400).json({ error: 'La matrícula o el correo ya están registrados.' });
  }
  console.error('Error al crear usuario:', error);
  res.status(500).json({ error: 'Error al crear usuario' });
}
});

router.put('/:matricula', verificarToken, permitirRoles('Administrador'), async (req, res) => {
  try {
    const { matricula } = req.params;

    const {
      nombre,
      segundo_nombre,
      apellido,
      segundo_apellido,
      correo,
      rol
    } = req.body;

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

    // Verificar si el correo ya está registrado por otro usuario
    const correoExistente = await sql.query`
      SELECT matricula FROM usuarios WHERE correo = ${correo} AND matricula <> ${matricula}
    `;

    if (correoExistente.recordset.length > 0) {
      return res.status(400).json({ error: 'El correo ya está en uso por otro usuario.' });
    }

    await sql.query`
      UPDATE usuarios SET
        nombre = ${nombre},
        segundo_nombre = ${segundo_nombre || null},
        apellido = ${apellido},
        segundo_apellido = ${segundo_apellido || null},
        correo = ${correo},
        rol = ${rol}
      WHERE matricula = ${matricula}
    `;

    res.status(200).json({ mensaje: 'Usuario actualizado correctamente' });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

router.delete('/:matricula', verificarToken, permitirRoles('Administrador'), async (req, res) => {
  try {
    const { matricula } = req.params;

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

    await sql.query`
      DELETE FROM usuarios WHERE matricula = ${matricula}
    `;

    res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});



module.exports = router;
