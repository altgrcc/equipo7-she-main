import React, { useEffect, useState } from 'react';
import { HiDownload, HiTrash, HiUpload } from 'react-icons/hi';

interface HistoricalFile {
  name: string;
  department: string;
  period: string;
  year: string;
  downloadUrl: string;
}

const departments = [
  { label: 'Académico', value: 'academico' },
  { label: 'Extraacadémico Deportivo', value: 'deportivo' },
  { label: 'Extraacadémico Cultural', value: 'cultural' },
  { label: 'Laboratoristas', value: 'laboratoristas' },
  { label: 'Tutoreo', value: 'tutoreo' },
];

interface HistoricoProps {
  onNavigate: (screen: string) => void;
}

const Historico: React.FC<HistoricoProps> = ({ onNavigate }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [files, setFiles] = useState<HistoricalFile[]>([]);

  useEffect(() => {
    if (!selectedDepartment) return;

    fetch(`http://localhost:3000/${selectedDepartment}/historico`)
      .then(res => res.json())
      .then(data => setFiles(data))
      .catch(err => {
        console.error('Error al obtener histórico:', err);
        setFiles([]);
      });
  }, [selectedDepartment]);

  const handleDelete = async (file: HistoricalFile) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar "${file.name}"?`)) return;

    try {
      const res = await fetch(`http://localhost:3000/${file.department}/borrar-archivo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName: file.name }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Archivo eliminado correctamente');
        setFiles(prev => prev.filter(f => f.name !== file.name));
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error al eliminar archivo:', error);
      alert('Error de conexión con el servidor');
    }
  };

  const filesByPeriod = files.reduce((acc, file) => {
    if (!acc[file.period]) acc[file.period] = [];
    acc[file.period].push(file);
    return acc;
  }, {} as Record<string, HistoricalFile[]>);

  return (
    <div className="p-6 h-full bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Histórico de Evaluaciones</h1>
        <button
          onClick={() => onNavigate('Subir Excel')}
          className="flex items-center gap-2 bg-white/30 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-lg hover:bg-green-500 hover:text-white transition-all duration-200 text-gray-800 font-medium"
        >
          <HiUpload className="w-5 h-5" />
          Subir Excel
        </button>
      </div>

      <div className="mb-6">
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="px-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:border-blue-500/50 transition duration-150"
        >
          <option label="">Selecciona un departamento</option>
          {departments.map((dept) => (
            <option key={dept.value} value={dept.value}>
              {dept.label}
            </option>
          ))}
        </select>
      </div>

      {selectedDepartment ? (
        <div className="space-y-8">
          {Object.entries(filesByPeriod).length > 0 ? (
            Object.entries(filesByPeriod).map(([period, group]) => (
              <div key={period} className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Período {period}</h2>
                {group.map((file) => (
                  <div
                    key={file.name}
                    className="bg-white/30 backdrop-blur-lg p-4 rounded-2xl shadow border border-white/20"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {file.year}_{selectedDepartment.charAt(0).toUpperCase() + selectedDepartment.slice(1)}_{file.period}
                        </h3>
                        <p className="text-sm text-gray-600">Año: {file.year}</p>
                      </div>
                      <div className="flex space-x-2">
                        <a
                          href={`http://localhost:3000${file.downloadUrl}`}
                          className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50/50 transition"
                          title="Descargar archivo"
                          download
                        >
                          <HiDownload className="w-5 h-5" />
                        </a>
                        <button
                          onClick={() => handleDelete(file)}
                          className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50/50 transition"
                          title="Eliminar archivo"
                        >
                          <HiTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="bg-white/30 backdrop-blur-lg p-6 rounded-2xl text-center border border-white/20">
              <p className="text-gray-600">No hay archivos históricos disponibles para este departamento.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white/30 backdrop-blur-lg p-6 rounded-2xl text-center border border-white/20">
          <p className="text-gray-600">Selecciona un departamento para ver los archivos históricos</p>
        </div>
      )}
    </div>
  );
};

export default Historico;
