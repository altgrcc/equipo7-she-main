import React, { useState, useEffect } from 'react';

interface ExistingFile {
  filename: string;
  year: string;
  period: string;
  department: string;
}

const SubirExcel: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [year, setYear] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [period, setPeriod] = useState<string>('');
  const [existingFiles, setExistingFiles] = useState<ExistingFile[]>([]);
  const [showExistingFiles, setShowExistingFiles] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 2020 && Number(value) <= 3000)) {
      setYear(value);
    }
  };

  const handleUpload = async () => {
    if (file && year && department && period) {
      const formData = new FormData();
      formData.append('year', year);
      formData.append('departamento', department);
      formData.append('periodo', period);
      formData.append('excelFile', file);

      // Determinar endpoint según departamento
      let endpoint = '';
      switch (department) {
        case 'Académico':
          endpoint = '/academico/upload';
          break;
        case 'Extraacadémico Deportivo':
          endpoint = '/deportivo/upload';
          break;
        case 'Extraacadémico Cultural':
          endpoint = '/cultural/upload';
          break;
        case 'Laboratorista':
          endpoint = '/laboratoristas/upload';
          break;
        case 'Tutoreo':
          endpoint = '/tutoreo/upload';
          break;
        default:
          alert('Departamento no válido');
          return;
      }

      try {
        console.log('Enviando archivo a:', endpoint);
        const response = await fetch(`http://localhost:3000${endpoint}`, {
          method: 'POST',
          body: formData,
        });

        let result;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            result = await response.json();
          } else {
            const text = await response.text();
            console.error('Respuesta no JSON:', text);
            throw new Error('El servidor devolvió una respuesta no válida');
          }
        } catch (e) {
          console.error('Error al parsear respuesta:', e);
          throw new Error('Error al procesar la respuesta del servidor');
        }

        if (response.ok) {
          alert(result.mensaje || 'Archivo subido correctamente');
          // Limpiar el formulario después de una subida exitosa
          setFile(null);
          setYear('');
          setDepartment('');
          setPeriod('');
        } else {
          console.error('Error del servidor:', result);
          alert(result.error || 'Error al subir el archivo');
        }
      } catch (error) {
        console.error('Error en la subida:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        alert(`Error al subir el archivo: ${errorMessage}`);
      }
    } else {
      alert('Por favor complete todos los campos');
    }
  };

  const checkExistingFiles = async () => {
    if (department && period) {
      try {
        const response = await fetch(`http://localhost:3000/files/${department}/${period}`);
        if (response.ok) {
          const data = await response.json();
          setExistingFiles(data);
          setShowExistingFiles(data.length > 0);
        }
      } catch (error) {
        console.error('Error al verificar archivos existentes:', error);
      }
    }
  };

  useEffect(() => {
    if (department && period) {
      checkExistingFiles();
    } else {
      setExistingFiles([]);
      setShowExistingFiles(false);
    }
  }, [department, period]);

  const handleDownload = async (filename: string) => {
    try {
      const response = await fetch(`http://localhost:3000/files/download/${filename}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
      alert('Error al descargar el archivo');
    }
  };

  const isFormValid = file && year && department && period;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Subir Excel</h1>
      <div className="max-w-md space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Año
            </label>
            <input
              type="number"
              value={year}
              onChange={handleYearChange}
              min="2020"
              max="3000"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 2024"
              onKeyPress={(e) => e.preventDefault()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departamento
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione un departamento</option>
              <option value="Académico">Académico</option>
              <option value="Extraacadémico Deportivo">Extraacadémico Deportivo</option>
              <option value="Extraacadémico Cultural">Extraacadémico Cultural</option>
              <option value="Laboratorista">Laboratorista</option>
              <option value="Tutoreo">Tutoreo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Periodo
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione un periodo</option>
              <option value="1">Enero-Junio</option>
              <option value="2">Julio-Diciembre</option>
            </select>
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-blue-500 hover:text-blue-600"
          >
            Seleccionar archivo Excel
          </label>
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Archivo seleccionado: {file.name}
            </p>
          )}
        </div>

        {showExistingFiles && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Archivos existentes para este departamento y periodo:
            </h3>
            <ul className="space-y-2">
              {existingFiles.map((existingFile, index) => (
                <li key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm">
                    {existingFile.filename} (Año: {existingFile.year})
                  </span>
                  <button
                    onClick={() => handleDownload(existingFile.filename)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Descargar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!isFormValid}
          className={`w-full py-2 px-4 rounded-lg font-semibold ${
            isFormValid
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Subir Archivo
        </button>
      </div>
    </div>
  );
};

export default SubirExcel; 