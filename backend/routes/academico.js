const express = require('express');
const router = express.Router();
const sql = require('mssql');
const readXlsxFile = require('read-excel-file/node');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const connection = require('../dbConfig');

// ------------------------------------------------------
// Configuración de multer para subir archivos académicos
// ------------------------------------------------------
const uploadsDir = path.join(__dirname, '../uploads/academico');

// Asegurarse de que el directorio de uploads existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Directorio de uploads creado:', uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage });


// ------------------------------------------------------
// GET /upload - Mostrar formulario para subir archivo académico
// ------------------------------------------------------
router.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/uploadFileAcademico.html'));
});

// ------------------------------------------------------
// POST /upload - Subir nuevo archivo académico y guardar datos
// ------------------------------------------------------
router.post('/upload', upload.single('excelFile'), async (req, res) => {
  try {
    console.log('Iniciando subida de archivo...');
    console.log('Body:', req.body);
    console.log('File:', req.file);

    if (!req.file) {
      console.log('Error: No se proporcionó archivo');
      return res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
    }

    const { year, departamento, periodo } = req.body;
    if (!year || !departamento || !periodo) {
      console.log('Error: Faltan campos requeridos');
      return res.status(400).json({ error: 'Faltan campos requeridos: year, departamento o periodo' });
    }

    const originalPath = req.file.path;
    const fileExtension = path.extname(req.file.originalname);
    const baseName = `${year}_${departamento}_${periodo}`;
    const finalPath = path.join(uploadsDir, `${baseName}${fileExtension}`);

    console.log('Rutas:', { originalPath, finalPath });

    if (fs.existsSync(finalPath)) {
      console.log('Error: Archivo ya existe');
      fs.unlinkSync(originalPath);
      return res.status(400).json({ error: 'Ya existe una encuesta académica para este periodo.' });
    }

    fs.renameSync(originalPath, finalPath);
    console.log('Archivo movido a:', finalPath);

    const rows = await readXlsxFile(finalPath);
    console.log('Archivo Excel leído correctamente');
    
    const preguntas = rows[0].slice(4);
    const data = rows.slice(3);
    
    console.log('Conectando a la base de datos...');
    const pool = await sql.connect(connection);
    console.log('Conexión a BD establecida');

    // Crear objetos JSON con los datos del archivo
    const jsonObjects = data.map((row) => {
      const obj = {
        grupo: (row[0]?.toString().trim().toUpperCase()) || '',
        comentario: row[1] || 'NA',
        profesor: row[2] || '',
        clase: row[3] || '',
        year: year.trim(),
        periodo: parseInt(periodo)
      };
      for (let i = 0; i < 13; i++) {
        obj[`r${i+1}`] = row[i+4] ?? 'NA';
      }
      return obj;
    });

    console.log('Iniciando inserción de datos...');
    // Insertar cada registro en la base de datos
    for (const item of jsonObjects) {
      try {
        await pool.request()
          .input('grupo', sql.Char, item.grupo)
          .input('comentario', sql.VarChar, item.comentario)
          .input('profesor', sql.VarChar, item.profesor)
          .input('clase', sql.VarChar, item.clase)
          .input('year', sql.Char, item.year)
          .input('periodo', sql.Int, item.periodo)
          .input('p1', sql.VarChar, preguntas[0])
          .input('p2', sql.VarChar, preguntas[1])
          .input('p3', sql.VarChar, preguntas[2])
          .input('p4', sql.VarChar, preguntas[3])
          .input('p5', sql.VarChar, preguntas[4])
          .input('p6', sql.VarChar, preguntas[5])
          .input('p7', sql.VarChar, preguntas[6])
          .input('p8', sql.VarChar, preguntas[7])
          .input('p9', sql.VarChar, preguntas[8])
          .input('p10', sql.VarChar, preguntas[9])
          .input('p11', sql.VarChar, preguntas[10])
          .input('p12', sql.VarChar, preguntas[11])
          .input('p13', sql.VarChar, preguntas[12])
          .input('r1', sql.Int, (item.r1))
          .input('r2', sql.Int, (item.r2))
          .input('r3', sql.Int, (item.r3))
          .input('r4', sql.Int, (item.r4))
          .input('r5', sql.Int, (item.r5))
          .input('r6', sql.Int, (item.r6))
          .input('r7', sql.Int, (item.r7))
          .input('r8', sql.Int, (item.r8))
          .input('r9', sql.Int, (item.r9))
          .input('r10', sql.Int, (item.r10))
          .input('r11', sql.Int, (item.r11))
          .input('r12', sql.Int, (item.r12))
          .input('r13', sql.Int, (item.r13))
          .query(`
            INSERT INTO academico 
            (grupo, comentario, profesor, clase, year, periodo, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13)
            VALUES 
            (@grupo, @comentario, @profesor, @clase, @year, @periodo, @p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8, @p9, @p10, @p11, @p12, @p13, @r1, @r2, @r3, @r4, @r5, @r6, @r7, @r8, @r9, @r10, @r11, @r12, @r13)
          `);
      } catch (error) {
        console.error('Error al insertar registro:', error);
        throw error;
      }
    }

    console.log('Proceso completado exitosamente');
    res.status(200).json({ mensaje: 'Archivo subido y procesado correctamente' });
  } catch (error) {
    console.error('Error en el servidor:', error);
    // Asegurarse de que el archivo temporal se elimine en caso de error
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ 
      error: 'Error interno del servidor al procesar el archivo',
      detalle: error.message 
    });
  }
});

// ------------------------------------------------------
// GET /update - Mostrar formulario para actualizar archivo académico
// ------------------------------------------------------
//router.get('/update', (req, res) => {
  //res.sendFile(path.join(__dirname, '../public/updateFileAcademico.html'));
//});

// ------------------------------------------------------
// PUT /upload - Actualizar archivo académico existente
// ------------------------------------------------------
router.put('/upload', upload.single('excelFile'), async (req, res) => {
  const { year, departamento, periodo } = req.body;
  const originalPath = req.file.path;
  const fileExtension = path.extname(req.file.originalname);
  const baseName = `${year}_${departamento}_${periodo}`;
  const finalPath = path.join(uploadsDir, `${baseName}${fileExtension}`);

  try {
    if (!fs.existsSync(finalPath)) {
      fs.unlinkSync(originalPath);
      return res.status(404).json({ error: 'No existe un archivo previo para actualizar.' });
    }

    fs.unlinkSync(finalPath);
    fs.renameSync(originalPath, finalPath);

    const rows = await readXlsxFile(finalPath);
    const preguntas = rows[0].slice(4);
    const data = rows.slice(3);
    const pool = await sql.connect(connection);

    // Eliminar registros previos
    await pool.request()
      .input('year', sql.Char, year.trim())
      .input('periodo', sql.Int, parseInt(periodo))
      .query('DELETE FROM academico WHERE year = @year AND periodo = @periodo');

    // Insertar nuevos registros
    const jsonObjects = data.map((row) => {
      const obj = {
        grupo: row[0]?.toString().trim() || '',
        comentario: row[1] || 'NA',
        profesor: row[2] || '',
        clase: row[3] || '',
        year: year.trim(),
        periodo: parseInt(periodo)
      };
      for (let i = 0; i < 13; i++) {
        obj[`r${i+1}`] = row[i+4] ?? 'NA';
      }
      return obj;
    });

    for (const item of jsonObjects) {
      await pool.request()
        .input('grupo', sql.Char, item.grupo)
        .input('comentario', sql.VarChar, item.comentario)
        .input('profesor', sql.VarChar, item.profesor)
        .input('clase', sql.VarChar, item.clase)
        .input('year', sql.Char, item.year)
        .input('periodo', sql.Int, item.periodo)
        .input('p1', sql.VarChar, preguntas[0])
        .input('p2', sql.VarChar, preguntas[1])
        .input('p3', sql.VarChar, preguntas[2])
        .input('p4', sql.VarChar, preguntas[3])
        .input('p5', sql.VarChar, preguntas[4])
        .input('p6', sql.VarChar, preguntas[5])
        .input('p7', sql.VarChar, preguntas[6])
        .input('p8', sql.VarChar, preguntas[7])
        .input('p9', sql.VarChar, preguntas[8])
        .input('p10', sql.VarChar, preguntas[9])
        .input('p11', sql.VarChar, preguntas[10])
        .input('p12', sql.VarChar, preguntas[11])
        .input('p13', sql.VarChar, preguntas[12])
        .input('r1', sql.Int, (item.r1))
        .input('r2', sql.Int, (item.r2))
        .input('r3', sql.Int, (item.r3))
        .input('r4', sql.Int, (item.r4))
        .input('r5', sql.Int, (item.r5))
        .input('r6', sql.Int, (item.r6))
        .input('r7', sql.Int, (item.r7))
        .input('r8', sql.Int, (item.r8))
        .input('r9', sql.Int, (item.r9))
        .input('r10', sql.Int, (item.r10))
        .input('r11', sql.Int, (item.r11))
        .input('r12', sql.Int, (item.r12))
        .input('r13', sql.Int, (item.r13))
        .query(`INSERT INTO academico (grupo, comentario, profesor, clase, year, periodo,
            p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13,
            r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13)
          VALUES (@grupo, @comentario, @profesor, @clase, @year, @periodo,
            @p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8, @p9, @p10, @p11, @p12, @p13,
            @r1, @r2, @r3, @r4, @r5, @r6, @r7, @r8, @r9, @r10, @r11, @r12, @r13)`);
    }

    res.status(200).json({ mensaje: 'Archivo académico actualizado y datos reinsertados correctamente.' });

  } catch (err) {
    console.error('Error en la actualización:', err);
    if (originalPath && fs.existsSync(originalPath)) {
      fs.unlinkSync(originalPath);
    }
    res.status(500).json({ error: 'Error al actualizar el archivo.' });
  }
});

// ------------------------------------------------------
// GET / - Consultar encuestas académicas por periodo y año
// ------------------------------------------------------
router.get('/', async (req, res) => {
  const { periodo, year } = req.query;

  if (!periodo || !year) {
    return res.status(400).json({ error: 'Debes proporcionar un periodo y un año.' });
  }

  try {
    const pool = await sql.connect(connection);
    const result = await pool.request()
      .input('periodo', sql.Int, periodo)
      .input('year', sql.Char, year)
      .query('SELECT * FROM academico WHERE periodo = @periodo AND year = @year');

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error al obtener las encuestas académicas:', error);
    res.status(500).json({ error: 'Error al obtener encuestas académicas.' });
  }
});

// ------------------------------------------------------
// GET /delete - Mostrar formulario para eliminar archivo académico
// ------------------------------------------------------
router.get('/delete', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/deleteFileAcademico.html'));
});

// ------------------------------------------------------
// GET /api/listar-archivos - Listar archivos académicos
// ------------------------------------------------------
router.get('/api/listar-archivos', (req, res) => {
  const uploadsDir = path.join(__dirname, '../uploads/academico');

  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error('Error leyendo la carpeta uploads:', err);
      return res.status(500).send('Error leyendo archivos.');
    }

    const excelFiles = files.filter(file => file.endsWith('.xlsx'));
    res.json(excelFiles);
  });
});

// ------------------------------------------------------
// POST /borrar-archivo - Eliminar archivo físico y registros de la BD
// ------------------------------------------------------
router.post('/borrar-archivo', async (req, res) => {
  try {
    const { fileName } = req.body;
    const uploadsDir = path.join(__dirname, '../uploads/academico');
    const filePath = path.join(uploadsDir, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('Archivo no encontrado.');
    }

    const [ year, departamento, periodo] = fileName.split('_');

    const pool = await sql.connect(connection);
    await pool.request()
      .input('year', sql.Char, year.trim())
      .input('periodo', sql.Int, parseInt(periodo))
      .query('DELETE FROM academico WHERE year = @year AND periodo = @periodo');

    fs.unlinkSync(filePath);

    const files = fs.readdirSync(uploadsDir);
    const excelFiles = files.filter(file => file.endsWith('.xlsx'));
    res.json(excelFiles);

  } catch (error) {
    console.error('Error al borrar:', error);
    res.status(500).send('Error eliminando archivo.');
  }
});

module.exports = router;
