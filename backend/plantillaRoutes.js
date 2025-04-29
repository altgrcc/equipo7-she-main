// routes/{nombreModulo}.js
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const readXlsxFile = require('read-excel-file/node');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const connection = require('../dbConfig');

// Configuracion de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/{nombreModulo}'));
  },
  filename: (req, file, cb) => {
    cb(null, 'temp.xlsx');
  }
});
const upload = multer({ storage });

function safeParseInt(value) {
  const parsed = parseInt(value);
  return isNaN(parsed) ? null : parsed;
}

// SUBIR NUEVO ARCHIVO
router.post('/upload', upload.single('excelFile'), async (req, res) => {
  const { parametro1, parametro2 } = req.body; // ajusta parametros
  const originalPath = req.file.path;
  const fileExtension = path.extname(req.file.originalname);
  const baseName = `${parametro1}_${parametro2}`;
  const folder = path.join(__dirname, '../uploads/{nombreModulo}');
  const finalPath = path.join(folder, `${baseName}${fileExtension}`);

  try {
    if (fs.existsSync(finalPath)) {
      fs.unlinkSync(originalPath);
      return res.status(400).json({ error: 'Ya existe un archivo para estos datos.' });
    }

    fs.renameSync(originalPath, finalPath);

    const rows = await readXlsxFile(finalPath);
    const data = rows.slice(1); // Ajustar según estructura del Excel

    const pool = await sql.connect(connection);

    const jsonObjects = data.map((row) => {
      return {
        campo1: row[0] || '',
        campo2: row[1] || '',
        valor1: safeParseInt(row[2]),
        // mapear más campos si es necesario
      };
    });

    for (const item of jsonObjects) {
      await pool.request()
        .input('campo1', sql.VarChar, item.campo1)
        .input('campo2', sql.VarChar, item.campo2)
        .input('valor1', sql.Int, item.valor1)
        .query(`INSERT INTO {NombreTabla} (campo1, campo2, valor1) VALUES (@campo1, @campo2, @valor1)`);
    }

    res.status(200).json({ mensaje: 'Archivo subido y datos insertados correctamente.' });

  } catch (err) {
    console.error('Error al procesar el archivo:', err);
    if (finalPath && fs.existsSync(finalPath)) {
      fs.unlinkSync(finalPath);
    }
    res.status(500).send('Error al procesar archivo.');
  }
});

// ACTUALIZAR ARCHIVO
router.put('/upload', upload.single('excelFile'), async (req, res) => {
  // igual que POST pero primero DELETE de registros existentes
});

// CONSULTAR DATOS
router.get('/', async (req, res) => {
  const { filtro } = req.query;

  if (!filtro) {
    return res.status(400).json({ error: 'Falta parametro filtro.' });
  }

  try {
    const pool = await sql.connect(connection);
    const result = await pool.request()
      .input('filtro', sql.VarChar, filtro)
      .query('SELECT * FROM {NombreTabla} WHERE campoFiltro = @filtro');

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'Error en consulta.' });
  }
});

// LISTAR ARCHIVOS
router.get('/api/listar-archivos', (req, res) => {
  const uploadsDir = path.join(__dirname, '../uploads/{nombreModulo}');

  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error('Error leyendo carpeta:', err);
      return res.status(500).send('Error leyendo archivos.');
    }
    const excelFiles = files.filter(file => file.endsWith('.xlsx'));
    res.json(excelFiles);
  });
});

// BORRAR ARCHIVO
router.post('/borrar-archivo', async (req, res) => {
  try {
    const { fileName } = req.body;
    const uploadsDir = path.join(__dirname, '../uploads/{nombreModulo}');
    const filePath = path.join(uploadsDir, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('Archivo no encontrado.');
    }

    const [parametro1, parametro2] = fileName.split('_');

    const pool = await sql.connect(connection);
    await pool.request()
      .input('parametro1', sql.VarChar, parametro1)
      .input('parametro2', sql.VarChar, parametro2)
      .query('DELETE FROM {NombreTabla} WHERE campo1 = @parametro1 AND campo2 = @parametro2');

    fs.unlinkSync(filePath);

    res.status(200).json({ mensaje: 'Archivo y datos eliminados.' });

  } catch (error) {
    console.error('Error al borrar:', error);
    res.status(500).send('Error eliminando.');
  }
});

module.exports = router;
