const express = require('express');
const router = express.Router();
const sql = require('mssql');
const readXlsxFile = require('read-excel-file/node');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const connection = require('../dbConfig');

const uploadsDir = path.join(__dirname, '../uploads/deportivo');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
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

router.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/uploadFileDeportivo.html'));
});

router.post('/upload', upload.single('excelFile'), async (req, res) => {
  try {
    const { year, departamento, periodo } = req.body;
    if (!year || !departamento || !periodo) {
      return res.status(400).json({ error: 'Faltan campos requeridos: year, departamento o periodo' });
    }

    const cleanYear = year.toString().trim();
    const cleanPeriodo = parseInt(periodo);

    const originalPath = req.file.path;
    const fileExtension = path.extname(req.file.originalname);
    const departamentoFinal = ['Extraacademico Deportivo', 'Extraacadémico Deportivo'].includes(departamento) ? 'Deportivo' : departamento;
    const baseName = `${cleanYear}_${departamentoFinal}_${cleanPeriodo}`;
    const finalPath = path.join(uploadsDir, `${baseName}${fileExtension}`);

    if (fs.existsSync(finalPath)) {
      fs.unlinkSync(originalPath);
      return res.status(400).json({ error: 'Ya existe una encuesta deportiva para este periodo.' });
    }

    fs.renameSync(originalPath, finalPath);

    const rows = await readXlsxFile(finalPath);
    const preguntas = rows[0];
    const data = rows.slice(1);
    const pool = await sql.connect(connection);

    const jsonObjects = data.map((row) => {
      let materia = '', profesor = '';
      if (row[0] && row[0].includes('.')) {
        [materia, profesor] = row[0].split('.');
        materia = materia.trim();
        profesor = profesor.trim();
      }
      const obj = {
        profesor,
        materia,
        year: cleanYear,
        periodo: cleanPeriodo
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
        .input('year', sql.Char, item.year)
        .input('periodo', sql.Int, item.periodo)
        .query(`INSERT INTO deportivo 
          (profesor, materia, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10,
           r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, year, periodo)
          VALUES
          (@profesor, @materia, @p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8, @p9, @p10,
           @r1, @r2, @r3, @r4, @r5, @r6, @r7, @r8, @r9, @r10, @year, @periodo)`);
    }

    res.status(200).json({ mensaje: 'Archivo deportivo subido e insertado correctamente.' });

  } catch (error) {
    console.error('Error al procesar el archivo deportivo:', error);
    res.status(500).json({ error: 'Error al procesar archivo deportivo' });
  }
});

router.put('/upload', upload.single('excelFile'), async (req, res) => {
  const { year, departamento, periodo } = req.body;
  const originalPath = req.file.path;
  const fileExtension = path.extname(req.file.originalname);
  const departamentoFinal = ['Extraacademico Deportivo', 'Extraacadémico Deportivo'].includes(departamento) ? 'Deportivo' : departamento;
  const baseName = `${year}_${departamentoFinal}_${periodo}`;
  const finalPath = path.join(uploadsDir, `${baseName}${fileExtension}`);

  try {
    if (!fs.existsSync(finalPath)) {
      fs.unlinkSync(originalPath);
      return res.status(404).json({ error: 'No existe un archivo previo para actualizar.' });
    }

    fs.unlinkSync(finalPath);
    fs.renameSync(originalPath, finalPath);

    const rows = await readXlsxFile(finalPath);
    const preguntas = rows[0];
    const data = rows.slice(1);
    const pool = await sql.connect(connection);

    await pool.request()
      .input('year', sql.Char, year)
      .input('periodo', sql.Int, parseInt(periodo))
      .query('DELETE FROM deportivo WHERE year = @year AND periodo = @periodo');

    const jsonObjects = data.map((row) => {
      let materia = '', profesor = '';
      if (row[0] && row[0].includes('.')) {
        [materia, profesor] = row[0].split('.');
        materia = materia.trim();
        profesor = profesor.trim();
      }
      const obj = {
        profesor,
        materia,
        year: year,
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
        .input('year', sql.Char, item.year)
        .input('periodo', sql.Int, item.periodo)
        .query(`INSERT INTO deportivo 
          (profesor, materia, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10,
           r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, year, periodo)
          VALUES
          (@profesor, @materia, @p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8, @p9, @p10,
           @r1, @r2, @r3, @r4, @r5, @r6, @r7, @r8, @r9, @r10, @year, @periodo)`);
    }

    res.status(200).json({ mensaje: 'Archivo deportivo actualizado e insertado correctamente.' });

  } catch (err) {
    console.error('Error en la actualización deportiva:', err);
    if (originalPath && fs.existsSync(originalPath)) {
      fs.unlinkSync(originalPath);
    }
    res.status(500).json({ error: 'Error al actualizar archivo deportivo.' });
  }
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

    const [year, departamentoFinal, periodoWithExtension] = fileName.split('_');
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

router.get('/historico', async (req, res) => {
  try {
    const pool = await sql.connect(connection);
    const result = await pool.request()
      .query(`SELECT DISTINCT year, periodo FROM deportivo ORDER BY year DESC, periodo DESC`);

    const data = result.recordset.map(row => ({
      name: `${row.year}_deportivo_${row.periodo}.xlsx`,
      department: 'deportivo',
      period: row.periodo,
      year: row.year,
      downloadUrl: `/download/deportivo/${row.year}_deportivo_${row.periodo}.xlsx`
    }));

    res.json(data);
  } catch (error) {
    console.error('Error obteniendo histórico deportivo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/resultados', async (req, res) => {
  const { year, periodo } = req.query;

  if (!year || !periodo) {
    return res.status(400).json({ error: 'Parámetros requeridos: year y periodo' });
  }

  try {
    const pool = await sql.connect(connection);

    // Obtener respuestas por profesor
    const result = await pool.request()
      .input('year', year)
      .input('periodo', periodo)
      .query(`
        SELECT profesor, materia, r1, r2, r3, r4, r5, r6, r7, r8, r9
        FROM deportivo
        WHERE year = @year AND periodo = @periodo
      `);

    const rows = result.recordset;
    const agrupado = {};

    rows.forEach((prof) => {
      const key = `${prof.profesor}__${prof.materia}`;
      const respuestas = [
        prof.r1, prof.r2, prof.r3, prof.r4, prof.r5,
        prof.r6, prof.r7, prof.r8, prof.r9
      ].map(Number).filter(n => !isNaN(n));

      if (!agrupado[key]) {
        agrupado[key] = { profesor: prof.profesor, materia: prof.materia, total: 0, count: 0 };
      }

      agrupado[key].total += respuestas.reduce((acc, n) => acc + n, 0);
      agrupado[key].count += respuestas.length;
    });

    const profesoresAgrupados = Object.values(agrupado).map(p => ({
      profesor: p.profesor,
      materia: p.materia,
      promedio: p.count ? p.total / p.count : null
    }));

    const profesoresValidos = profesoresAgrupados.filter(p => p.promedio !== null);

    const promedioDepto = profesoresValidos.length > 0
      ? profesoresValidos.reduce((acc, p) => acc + p.promedio, 0) / profesoresValidos.length
      : 0;

    // Obtener preguntas
    const preguntasResult = await pool.request()
      .input('year', year)
      .input('periodo', periodo)
      .query(`
        SELECT TOP 1 p1, p2, p3, p4, p5, p6, p7, p8, p9, p10
        FROM deportivo
        WHERE year = @year AND periodo = @periodo
      `);

    const preguntas = preguntasResult.recordset[0] || {};

    res.json({
      promedioDepartamento: promedioDepto.toFixed(1),
      profesores: profesoresAgrupados,
      preguntas
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener resultados' });
  }
});

router.get('/disponibles', async (req, res) => {
  try {
    const pool = await sql.connect(connection);
    const result = await pool.request()
      .query(`SELECT DISTINCT year, periodo FROM deportivo ORDER BY year DESC, periodo DESC`);

    const data = {};

    result.recordset.forEach(row => {
      const y = row.year.toString();
      if (!data[y]) data[y] = [];
      if (!data[y].includes(row.periodo.toString())) {
        data[y].push(row.periodo.toString());
      }
    });

    res.json(data);
  } catch (err) {
    console.error('Error en /deportivo/disponibles:', err);
    res.status(500).json({ error: 'Error al obtener años/periodos' });
  }
});
module.exports = router;
