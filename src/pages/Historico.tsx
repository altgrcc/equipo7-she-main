import React, { useState } from 'react';
import { HiDownload, HiTrash, HiUpload } from 'react-icons/hi';

interface HistoricalFile {
  id: string;
  name: string;
  department: string;
  period: string;
  year: string;
  uploadDate: string;
  downloadUrl: string;
}

// Mock data for historical files
const mockHistoricalFiles: HistoricalFile[] = [
  {
    id: '1',
    name: 'Evaluaciones_Academico_2024-1.xlsx',
    department: 'Académico',
    period: '2024-1',
    year: '2024',
    uploadDate: '2024-03-15',
    downloadUrl: '/download/academico/2024-1'
  },
  {
    id: '2',
    name: 'Evaluaciones_Deportivo_2024-1.xlsx',
    department: 'Extraacadémico Deportivo',
    period: '2024-1',
    year: '2024',
    uploadDate: '2024-03-14',
    downloadUrl: '/download/deportivo/2024-1'
  },
  {
    id: '3',
    name: 'Evaluaciones_Deportivo_2024-2.xlsx',
    department: 'Extraacadémico Deportivo',
    period: '2024-2',
    year: '2024',
    uploadDate: '2024-03-20',
    downloadUrl: '/download/deportivo/2024-2'
  },
  {
    id: '4',
    name: 'Evaluaciones_Deportivo_2023-2.xlsx',
    department: 'Extraacadémico Deportivo',
    period: '2023-2',
    year: '2023',
    uploadDate: '2023-12-15',
    downloadUrl: '/download/deportivo/2023-2'
  },
  {
    id: '5',
    name: 'Evaluaciones_Cultural_2024-1.xlsx',
    department: 'Extraacadémico Cultural',
    period: '2024-1',
    year: '2024',
    uploadDate: '2024-03-13',
    downloadUrl: '/download/cultural/2024-1'
  },
  {
    id: '6',
    name: 'Evaluaciones_Laboratoristas_2024-1.xlsx',
    department: 'Laboratorista',
    period: '2024-1',
    year: '2024',
    uploadDate: '2024-03-12',
    downloadUrl: '/download/laboratoristas/2024-1'
  },
  {
    id: '7',
    name: 'Evaluaciones_Tutoreo_2024-1.xlsx',
    department: 'Tutoreo',
    period: '2024-1',
    year: '2024',
    uploadDate: '2024-03-11',
    downloadUrl: '/download/tutoreo/2024-1'
  }
];

const departments = [
  'Académico',
  'Extraacadémico Deportivo',
  'Extraacadémico Cultural',
  'Laboratorista',
  'Tutoreo'
];

interface HistoricoProps {
  onNavigate: (screen: string) => void;
}

const Historico: React.FC<HistoricoProps> = ({ onNavigate }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [files, setFiles] = useState<HistoricalFile[]>(mockHistoricalFiles);

  const filteredFiles = files.filter(
    file => file.department === selectedDepartment
  );

  // Agrupar archivos por período
  const filesByPeriod = filteredFiles.reduce((acc, file) => {
    if (!acc[file.period]) {
      acc[file.period] = [];
    }
    acc[file.period].push(file);
    return acc;
  }, {} as Record<string, HistoricalFile[]>);

  const handleDownload = (file: HistoricalFile) => {
    // In a real implementation, this would trigger the file download
    console.log('Downloading file:', file.name);
    // window.location.href = file.downloadUrl;
  };

  const handleDelete = (fileId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este archivo?')) {
      setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    }
  };

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
          <option value="">Selecciona un departamento</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {selectedDepartment ? (
        <div className="space-y-8">
          {Object.entries(filesByPeriod).length > 0 ? (
            Object.entries(filesByPeriod).map(([period, files]) => (
              <div key={period} className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Período {period}</h2>
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="bg-white/30 backdrop-blur-lg p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">{file.name}</h3>
                        <p className="text-sm text-gray-600">
                          Subido el: {new Date(file.uploadDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDownload(file)}
                          className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50/50 transition-colors duration-200"
                          title="Descargar archivo"
                        >
                          <HiDownload className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50/50 transition-colors duration-200"
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
            <div className="bg-white/30 backdrop-blur-lg p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 text-center">
              <p className="text-gray-600">No hay archivos históricos disponibles para este departamento</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white/30 backdrop-blur-lg p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 text-center">
          <p className="text-gray-600">Selecciona un departamento para ver los archivos históricos</p>
        </div>
      )}
    </div>
  );
};

export default Historico; 