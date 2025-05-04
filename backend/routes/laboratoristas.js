const express = require('express');
const router = express.Router();
const sql = require('mssql');
const readXlsxFile = require('read-excel-file/node');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const connection = require('../dbConfig');

// ------------------------------------------------------
// Configuración de multer
// ------------------------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/laboratoristas'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage });


// ------------------------------------------------------
// POST /upload - Subir nuevo archivo y guardar datos
// ------------------------------------------------------
router.post('/upload', upload.single('excelFile'), async (req, res) => {
  const { year, departamento, periodo } = req.body;
  const originalPath = req.file.path;
  const fileExtension = path.extname(req.file.originalname);
  const departamentoFinal = ['Laboratorista', 'laboratorista'].includes(departamento) ? 'Laboratoristas' : departamento;
  const baseName = `${year}_${departamentoFinal}_${periodo}`;
  const folder = path.join(__dirname, '../uploads/laboratoristas');
  const finalPath = path.join(folder, `${baseName}${fileExtension}`);

  try {
    if (fs.existsSync(finalPath)) {
      fs.unlinkSync(originalPath);
      return res.status(400).json({ error: 'Ya existe una encuesta de laboratoristas para este periodo.' });
    }

    fs.renameSync(originalPath, finalPath);
    const rows = await readXlsxFile(finalPath);
    const preguntas = rows[0].slice(2, 15);
    const data = rows.slice(1);
    const pool = await sql.connect(connection);

    const jsonObjects = data.map((row) => {
      const obj = {
        grupo: row[0]?.toString().trim() || '',
        profesor: row[1]?.toString().trim() || '',
        year: year.trim(),
        periodo: parseInt(periodo)
      };
      for (let i = 0; i < 13; i++) {
        obj[`r${i+1}`] = row[i+2] ?? 'NA';
      }
      return obj;
    });

    for (const item of jsonObjects) {
      await pool.request()
        .input('grupo', sql.Char, item.grupo)
        .input('profesor', sql.VarChar, item.profesor)
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
        .input('r13', sql.VarChar, item.r13)
        .input('year', sql.Char, item.year)
        .input('periodo', sql.Int, item.periodo)
        .query(`INSERT INTO laboratoristas (grupo, profesor, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13,
          r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, year, periodo)
          VALUES (@grupo, @profesor, @p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8, @p9, @p10, @p11, @p12, @p13,
          @r1, @r2, @r3, @r4, @r5, @r6, @r7, @r8, @r9, @r10, @r11, @r12, @r13, @year, @periodo)`);
    }

    res.status(200).json({ mensaje: 'Archivo de laboratoristas subido e insertado correctamente.' });

  } catch (err) {
    console.error('Error al procesar el archivo de laboratoristas:', err);
    if (finalPath && fs.existsSync(finalPath)) {
      fs.unlinkSync(finalPath);
    }
    res.status(500).send('Error al procesar e insertar datos de laboratoristas.');
  }
});


// ------------------------------------------------------
// PUT /upload - Actualizar archivo existente y reemplazar datos
// ------------------------------------------------------
router.put('/upload', upload.single('excelFile'), async (req, res) => {
  const { year, departamento, periodo } = req.body;
  const originalPath = req.file.path;
  const fileExtension = path.extname(req.file.originalname);
  const departamentoFinal = ['Laboratorista', 'laboratorista'].includes(departamento) ? 'Laboratoristas' : departamento;
  const baseName = `${year}_${departamentoFinal}_${periodo}`;
  const folder = path.join(__dirname, '../uploads/laboratoristas');
  const finalPath = path.join(folder, `${baseName}${fileExtension}`);

  try {
    if (!fs.existsSync(finalPath)) {
      fs.unlinkSync(originalPath);
      return res.status(404).json({ error: 'No existe un archivo previo para actualizar.' });
    }

    fs.unlinkSync(finalPath);
    fs.renameSync(originalPath, finalPath);

    const rows = await readXlsxFile(finalPath);
    const preguntas = rows[0].slice(2, 15);
    const data = rows.slice(1);
    const pool = await sql.connect(connection);

    await pool.request()
      .input('year', sql.Char, year.trim())
      .input('periodo', sql.Int, parseInt(periodo))
      .query(`DELETE FROM laboratoristas WHERE year = @year AND periodo = @periodo`);

    const jsonObjects = data.map((row) => {
      const obj = {
        grupo: row[0]?.toString().trim() || '',
        profesor: row[1]?.toString().trim() || '',
        year: year.trim(),
        periodo: parseInt(periodo)
      };
      for (let i = 0; i < 13; i++) {
        obj[`r${i+1}`] = row[i+2] ?? 'NA';
      }
      return obj;
    });

    for (const item of jsonObjects) {
      await pool.request()
        .input('grupo', sql.Char, item.grupo)
        .input('profesor', sql.VarChar, item.profesor)
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
        .input('r13', sql.VarChar, item.r13)
        .input('year', sql.Char, item.year)
        .input('periodo', sql.Int, item.periodo)
        .query(`INSERT INTO laboratoristas (grupo, profesor, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13,
          r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, year, periodo)
          VALUES (@grupo, @profesor, @p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8, @p9, @p10, @p11, @p12, @p13,
          @r1, @r2, @r3, @r4, @r5, @r6, @r7, @r8, @r9, @r10, @r11, @r12, @r13, @year, @periodo)`);
    }

    res.status(200).json({ mensaje: 'Archivo de laboratoristas actualizado correctamente.' });

  } catch (err) {
    console.error('Error en la actualización:', err);
    if (fs.existsSync(originalPath)) {
      fs.unlinkSync(originalPath);
    }
    res.status(500).json({ error: 'Error al actualizar el archivo.' });
  }
});

// ------------------------------------------------------
// GET /api/listar-archivos - Listar archivos .xlsx existentes
// ------------------------------------------------------
router.get('/api/listar-archivos', (req, res) => {
    const uploadsDir = path.join(__dirname, '../uploads/laboratoristas');
  
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
// POST /borrar-archivo - Borrar archivo físico y eliminar datos de BD
// ------------------------------------------------------
router.post('/borrar-archivo', async (req, res) => {
  try {
    const { fileName } = req.body;
    const uploadsDir = path.join(__dirname, '../uploads/laboratoristas');
    const filePath = path.join(uploadsDir, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('Archivo no encontrado.');
    }

    const [year, departamento, periodoWithExtension] = fileName.split('_');
    const periodo = parseInt(periodoWithExtension.split('.')[0]);

    const pool = await sql.connect(connection);
    await pool.request()
      .input('year', sql.Char, year.trim())
      .input('periodo', sql.Int, periodo)
      .query('DELETE FROM laboratoristas WHERE year = @year AND periodo = @periodo');

    fs.unlinkSync(filePath);

    const files = fs.readdirSync(uploadsDir);
    const excelFiles = files.filter(file => file.endsWith('.xlsx'));
    res.json(excelFiles);

  } catch (error) {
    console.error('Error al borrar archivo laboratoristas:', error);
    res.status(500).send('Error eliminando archivo de laboratoristas.');
  }
});

router.get('/historico', async (req, res) => {
  try {
    const pool = await sql.connect(connection);
    const result = await pool.request()
      .query(`SELECT DISTINCT year, periodo FROM laboratoristas ORDER BY year DESC, periodo DESC`);

    const data = result.recordset.map(row => ({
      name: `${row.year}_Laboratoristas_${row.periodo}.xlsx`,
      department: 'Laboratoristas',
      period: row.periodo,
      year: row.year,
      downloadUrl: `/download/laboratoristas/${row.year}_Laboratoristas_${row.periodo}.xlsx`
    }));

    res.json(data);
  } catch (error) {
    console.error('Error obteniendo histórico laboratoristas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
  
module.exports = router;
