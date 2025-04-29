import React, { useState } from 'react';

const SubirExcel: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [year, setYear] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [period, setPeriod] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file && year && department && period) {
      // TODO: Implementar lógica de subida de archivo
      console.log('Datos a subir:', {
        file: file.name,
        year,
        department,
        period
      });
      alert('Funcionalidad de subida de archivo en desarrollo');
    } else {
      alert('Por favor complete todos los campos');
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
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 2024"
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
              <option value="Enero-Junio">Enero-Junio</option>
              <option value="Julio-Diciembre">Julio-Diciembre</option>
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