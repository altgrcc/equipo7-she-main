const express = require('express');
const router = express.Router();
const sql = require('mssql');
const readXlsxFile = require('read-excel-file/node');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const connection = require('../dbConfig');

// ------------------------------------------------------
// Configuración de multer para subir archivos deportivos
// ------------------------------------------------------
const uploadsDir = path.join(__dirname, '../uploads/deportivo');

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
// GET /upload - Mostrar formulario para subir archivo
// ------------------------------------------------------
router.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/uploadFileDeportivo.html'));
});

// ------------------------------------------------------
// POST /upload - Subir nuevo archivo y guardar datos
// ------------------------------------------------------
router.post('/upload', upload.single('excelFile'), async (req, res) => {
  const { year, departamento, periodo } = req.body;
  const originalPath = req.file.path;
  const fileExtension = path.extname(req.file.originalname);
  const baseName = `${year}_${departamento}_${periodo}`;
  const folder = path.join(__dirname, '../uploads/deportivo');
  
  // Función para generar un nombre único
  const getUniqueFileName = (baseName, extension) => {
    let counter = 1;
    let finalPath = path.join(folder, `${baseName}${extension}`);
    
    while (fs.existsSync(finalPath)) {
      finalPath = path.join(folder, `${baseName}_${counter}${extension}`);
      counter++;
    }
    
    return finalPath;
  };

  const finalPath = getUniqueFileName(baseName, fileExtension);

  try {
    fs.renameSync(originalPath, finalPath);

    const rows = await readXlsxFile(finalPath);
    const preguntas = rows[0];
    const data = rows.slice(1);
    const pool = await sql.connect(connection);

    const jsonObjects = data.map((row) => {
      const [materia, profesor] = row[0]?.split('.') || ['', ''];
      const obj = {
        profesor: profesor.trim(),
        materia: materia.trim(),
        year: (year),
        periodo: (periodo)
      };
      for (let i = 1; i <= 10; i++) {
        obj[`r${i}`] = (row[i] !== null && row[i] !== undefined) ? row[i] : 'NA';
      }
      return obj;
    });

    for (const item of jsonObjects) {
      await pool.request()
        .input('profesor', sql.VarChar, item.profesor)
        .input('materia', sql.VarChar, item.materia)
        .input('p1', sql.VarChar, preguntas[1])
        .input('p2', sql.VarChar, preguntas[2])
        .input('p3', sql.VarChar, preguntas[3])
        .input('p4', sql.VarChar, preguntas[4])
        .input('p5', sql.VarChar, preguntas[5])
        .input('p6', sql.VarChar, preguntas[6])
        .input('p7', sql.VarChar, preguntas[7])
        .input('p8', sql.VarChar, preguntas[8])
        .input('p9', sql.VarChar, preguntas[9])
        .input('p10', sql.VarChar, preguntas[10])
        .input('r1', sql.Int, (item.r1))
        .input('r2', sql.Int, (item.r2))
        .input('r3', sql.Int, (item.r3))
        .input('r4', sql.Int, (item.r4))
        .input('r5', sql.Int, (item.r5))
        .input('r6', sql.Int, (item.r6))
        .input('r7', sql.Int, (item.r7))
        .input('r8', sql.Int, (item.r8))
        .input('r9', sql.Int, (item.r9))
        .input('r10', sql.VarChar, item.r10)
        .input('year', sql.Int, item.year)
        .input('periodo', sql.Int, item.periodo)
        .query(`INSERT INTO deportivo 
          (profesor, materia, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10,
           r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, year, periodo)
          VALUES
          (@profesor, @materia, @p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8, @p9, @p10,
           @r1, @r2, @r3, @r4, @r5, @r6, @r7, @r8, @r9, @r10, @year, @periodo)`);
    }

    res.status(200).json({ mensaje: 'Archivo deportivo subido e insertado correctamente.' });

  } catch (err) {
    console.error('Error al procesar el archivo deportivo:', err);
    if (finalPath && fs.existsSync(finalPath)) {
      fs.unlinkSync(finalPath);
    }
    res.status(500).json({ error: 'Error al procesar e insertar datos deportivos.' });
  }
});

// ------------------------------------------------------
// GET /update - Mostrar formulario para actualizar archivo
// ------------------------------------------------------
router.get('/update', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/updateFileDeportivo.html'));
});

// ------------------------------------------------------
// PUT /upload - Actualizar archivo existente y reemplazar datos
// ------------------------------------------------------
router.put('/upload', upload.single('excelFile'), async (req, res) => {
  const { year, departamento, periodo } = req.body;
  const originalPath = req.file.path;
  const fileExtension = path.extname(req.file.originalname);
  const baseName = `${year}_${departamento}_${periodo}`;
  const folder = path.join(__dirname, '../uploads/deportivo');
  const finalPath = path.join(folder, `${baseName}${fileExtension}`);

  try {
    if (!fs.existsSync(finalPath)) {
      fs.unlinkSync(originalPath);
      return res.status(404).json({ error: 'No existe un archivo previo para actualizar.' });
    }

    // ⚡ Solo renombrar encima
    fs.renameSync(originalPath, finalPath);

    // Ahora leer
    const rows = await readXlsxFile(finalPath);
    const preguntas = rows[0];
    const data = rows.slice(1);
    const pool = await sql.connect(connection);

    // Borrar registros viejos
    await pool.request()
      .input('year', sql.Int, parseInt(year))
      .input('periodo', sql.Int, parseInt(periodo))
      .query('DELETE FROM deportivo WHERE year = @year AND periodo = @periodo');

    // Mapear e insertar nuevos datos
    const jsonObjects = data.map((row) => {
      const [materia, profesor] = row[0]?.split('.') || ['', ''];
      const obj = {
        profesor: profesor.trim(),
        materia: materia.trim(),
        year: parseInt(year),
        periodo: parseInt(periodo)
      };
      for (let i = 1; i <= 10; i++) {
        obj[`r${i}`] = (row[i] !== null && row[i] !== undefined) ? row[i] : 'NA';
      }
      return obj;
    });

    for (const item of jsonObjects) {
      await pool.request()
        .input('profesor', sql.VarChar, item.profesor)
        .input('materia', sql.VarChar, item.materia)
        .input('p1', sql.VarChar, preguntas[1])
        .input('p2', sql.VarChar, preguntas[2])
        .input('p3', sql.VarChar, preguntas[3])
        .input('p4', sql.VarChar, preguntas[4])
        .input('p5', sql.VarChar, preguntas[5])
        .input('p6', sql.VarChar, preguntas[6])
        .input('p7', sql.VarChar, preguntas[7])
        .input('p8', sql.VarChar, preguntas[8])
        .input('p9', sql.VarChar, preguntas[9])
        .input('p10', sql.VarChar, preguntas[10])
        .input('r1', sql.Int, item.r1)
        .input('r2', sql.Int, item.r2)
        .input('r3', sql.Int, item.r3)
        .input('r4', sql.Int, item.r4)
        .input('r5', sql.Int, item.r5)
        .input('r6', sql.Int, item.r6)
        .input('r7', sql.Int, item.r7)
        .input('r8', sql.Int, item.r8)
        .input('r9', sql.Int, item.r9)
        .input('r10', sql.VarChar, item.r10)
        .input('year', sql.Int, item.year)
        .input('periodo', sql.Int, item.periodo)
        .query(`INSERT INTO deportivo 
          (profesor, materia, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10,
           r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, year, periodo)
          VALUES
          (@profesor, @materia, @p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8, @p9, @p10,
           @r1, @r2, @r3, @r4, @r5, @r6, @r7, @r8, @r9, @r10, @year, @periodo)`);
    }

    res.status(200).json({ mensaje: 'Archivo deportivo actualizado y datos reinsertados correctamente.' });

  } catch (err) {
    console.error('Error en la actualización deportiva:', err);
    if (originalPath && fs.existsSync(originalPath)) {
      fs.unlinkSync(originalPath);
    }
    res.status(500).json({ error: 'Error al actualizar el archivo deportivo.' });
  }
});

// ------------------------------------------------------
// GET / - Consultar datos por periodo
// ------------------------------------------------------
router.get('/', async (req, res) => {
  const { periodo } = req.query;
  if (!periodo) {
    return res.status(400).json({ error: 'Debes proporcionar un periodo (1 o 2).' });
  }

  try {
    const pool = await sql.connect(connection);
    const result = await pool.request()
      .input('periodo', sql.Int, (periodo))
      .query('SELECT * FROM deportivo WHERE periodo = @periodo');

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error al obtener datos deportivos:', error);
    res.status(500).json({ error: 'Error al obtener datos deportivos.' });
  }
});

// ------------------------------------------------------
// GET /delete - Mostrar formulario para eliminar archivo
// ------------------------------------------------------
router.get('/delete', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/deleteFileDeportivo.html'));
});

// ------------------------------------------------------
// GET /api/listar-archivos - Listar archivos Deportivos
// ------------------------------------------------------
router.get('/api/listar-archivos', (req, res) => {
  const uploadsDir = path.join(__dirname, '../uploads/deportivo');

  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error('Error leyendo carpeta uploads deportivo:', err);
      return res.status(500).send('Error leyendo archivos.');
    }

    const excelFiles = files.filter(file => file.endsWith('.xlsx'));
    res.json(excelFiles);
  });
});

// ------------------------------------------------------
// POST /borrar-archivo - Borrar archivo físico y registros
// ------------------------------------------------------
router.post('/borrar-archivo', async (req, res) => {
  try {
    const { fileName } = req.body;
    const uploadsDir = path.join(__dirname, '../uploads/deportivo');
    const filePath = path.join(uploadsDir, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('Archivo no encontrado.');
    }

    const [year, departamento, periodoWithExtension] = fileName.split('_');
    const periodo = periodoWithExtension.split('.')[0];

    const pool = await sql.connect(connection);
    await pool.request()
      .input('year', sql.Int, (year))
      .input('periodo', sql.Int, (periodo))
      .query('DELETE FROM deportivo WHERE year = @year AND periodo = @periodo');

    fs.unlinkSync(filePath);

    const files = fs.readdirSync(uploadsDir);
    const excelFiles = files.filter(file => file.endsWith('.xlsx'));
    res.json(excelFiles);

  } catch (error) {
    console.error('Error al borrar archivo deportivo:', error);
    res.status(500).send('Error eliminando archivo deportivo.');
  }
});

module.exports = router;
