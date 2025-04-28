import { useLocation, useNavigate } from 'react-router-dom';

interface Professor {
  id: string;
  name: string;
  matricula: string;
  department: string;
  subject: string;
}

const ProfesorDetalles = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const professor = location.state?.professor as Professor;

  if (!professor) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Profesor no encontrado</h1>
        <button
          onClick={() => navigate('/departamentos')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Volver a Departamentos
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/departamentos')}
        className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Volver
      </button>

      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">{professor.name}</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Matrícula</h2>
            <p className="text-lg">{professor.matricula}</p>
          </div>
          
          <div>
            <h2 className="text-sm font-medium text-gray-500">Departamento</h2>
            <p className="text-lg">{professor.department}</p>
          </div>
          
          <div>
            <h2 className="text-sm font-medium text-gray-500">Materia</h2>
            <p className="text-lg">{professor.subject}</p>
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
};

export default ProfesorDetalles; 