import React, { useState } from 'react';

const SubirExcel: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      // TODO: Implementar lógica de subida de archivo
      console.log('Archivo a subir:', file.name);
      alert('Funcionalidad de subida de archivo en desarrollo');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Subir Excel</h1>
      <div className="max-w-md space-y-4">
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
          disabled={!file}
          className={`w-full py-2 px-4 rounded-lg font-semibold ${
            file
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