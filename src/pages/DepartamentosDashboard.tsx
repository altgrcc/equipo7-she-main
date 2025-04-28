import { useState } from 'react';

interface Professor {
  id: string;
  name: string;
  matricula: string;
  department: string;
  subject: string;
}

const departments = [
  'Ciencias Básicas',
  'Ingeniería Civil',
  'Ingeniería Industrial',
  'Ingeniería Mecánica',
  'Ingeniería Eléctrica',
  'Ingeniería en Sistemas',
];

const professors: Professor[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    matricula: '12345',
    department: 'Ciencias Básicas',
    subject: 'Matemáticas',
  },
  {
    id: '2',
    name: 'María García',
    matricula: '67890',
    department: 'Ingeniería Civil',
    subject: 'Estructuras',
  },
  {
    id: '3',
    name: 'Carlos López',
    matricula: '54321',
    department: 'Ingeniería Industrial',
    subject: 'Procesos',
  },
  {
    id: '4',
    name: 'Ana Martínez',
    matricula: '98765',
    department: 'Ingeniería Mecánica',
    subject: 'Termodinámica',
  },
];

const DepartamentosDashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);

  const handleProfessorClick = (professor: Professor) => {
    setSelectedProfessor(professor);
  };

  const handleBackClick = () => {
    setSelectedProfessor(null);
  };

  const filteredProfessors = professors.filter(
    (prof) => prof.department === selectedDepartment
  );

  if (selectedProfessor) {
    return (
      <div className="p-6 h-full bg-gray-50">
        <button
          onClick={handleBackClick}
          className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Volver
        </button>

        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">{selectedProfessor.name}</h1>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Matrícula</h2>
              <p className="text-lg">{selectedProfessor.matricula}</p>
            </div>
            
            <div>
              <h2 className="text-sm font-medium text-gray-500">Departamento</h2>
              <p className="text-lg">{selectedProfessor.department}</p>
            </div>
            
            <div>
              <h2 className="text-sm font-medium text-gray-500">Materia</h2>
              <p className="text-lg">{selectedProfessor.subject}</p>
            </div>
            
            <div>
              <h2 className="text-sm font-medium text-gray-500">Resultados de Evaluaciones</h2>
              <div className="mt-2 p-4 bg-gray-50 rounded">
                <p className="text-gray-500">Los resultados de evaluaciones se mostrarán aquí</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Departamentos</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDepartment(dept)}
            className={`p-4 rounded-lg border transition-colors duration-200 ${
              selectedDepartment === dept
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white hover:bg-gray-100 border-gray-200'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {selectedDepartment && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Profesores de {selectedDepartment}
          </h2>
          <div className="space-y-4">
            {filteredProfessors.length > 0 ? (
              filteredProfessors.map((professor) => (
                <div
                  key={professor.id}
                  onClick={() => handleProfessorClick(professor)}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200 bg-white"
                >
                  <h3 className="font-medium">{professor.name}</h3>
                  <p className="text-sm text-gray-600">
                    Matrícula: {professor.matricula}
                  </p>
                  <p className="text-sm text-gray-600">
                    Materia: {professor.subject}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 border rounded-lg bg-white">
                <p className="text-gray-500">No hay profesores registrados en este departamento</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartamentosDashboard; 