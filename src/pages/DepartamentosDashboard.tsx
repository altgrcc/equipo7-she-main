import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Professor {
  id: string;
  name: string;
  matricula: string;
  department: string;
  subject: string;
  evaluationScore?: number;
}

interface QuestionResult {
  question: string;
  averageScore: number;
  responses: number[];
}

const departments = [
  'Académico',
  'Extraacadémico Deportivo',
  'Extraacadémico Cultural',
  'Laboratorista',
  'Tutoreo'
];

const periods = [
  '2023-2',
  '2024-1',
  '2024-2',
];

// Mock data for evaluation results
const mockQuestionResults: QuestionResult[] = [
  {
    question: "1. ¿El profesor explica claramente los conceptos?",
    averageScore: 8.5,
    responses: [8, 9, 7, 9, 8, 9, 8, 9, 8, 7],
  },
  {
    question: "2. ¿El profesor fomenta la participación en clase?",
    averageScore: 7.8,
    responses: [8, 7, 8, 7, 8, 8, 7, 8, 8, 7],
  },
  {
    question: "3. ¿El profesor está disponible para consultas?",
    averageScore: 9.2,
    responses: [9, 9, 10, 9, 9, 9, 9, 10, 9, 9],
  },
];

const professors: Professor[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    matricula: '12345',
    department: 'Académico',
    subject: 'Matemáticas II',
    evaluationScore: 9.2,
  },
  {
    id: '2',
    name: 'María García',
    matricula: '67890',
    department: 'Académico',
    subject: 'Física',
    evaluationScore: 8.8,
  },
  {
    id: '3',
    name: 'Carlos López',
    matricula: '54321',
    department: 'Extraacadémico Deportivo',
    subject: 'Fútbol',
    evaluationScore: 8.5,
  },
  {
    id: '4',
    name: 'Ana Martínez',
    matricula: '98765',
    department: 'Extraacadémico Deportivo',
    subject: 'Básquetbol',
    evaluationScore: 9.0,
  },
  {
    id: '5',
    name: 'Pedro Sánchez',
    matricula: '13579',
    department: 'Extraacadémico Cultural',
    subject: 'Piano',
    evaluationScore: 9.5,
  },
  {
    id: '6',
    name: 'Laura Ramírez',
    matricula: '24680',
    department: 'Extraacadémico Cultural',
    subject: 'Teatro',
    evaluationScore: 8.7,
  },
  {
    id: '7',
    name: 'Roberto Torres',
    matricula: '86420',
    department: 'Laboratorista',
    subject: 'Química',
    evaluationScore: 9.1,
  },
  {
    id: '8',
    name: 'Sofía Mendoza',
    matricula: '97531',
    department: 'Laboratorista',
    subject: 'Biología',
    evaluationScore: 8.9,
  },
  {
    id: '9',
    name: 'Miguel Ángel',
    matricula: '35791',
    department: 'Tutoreo',
    subject: 'Tutoreo III',
    evaluationScore: 9.3,
  },
  {
    id: '10',
    name: 'Elena Ruiz',
    matricula: '46802',
    department: 'Tutoreo',
    subject: 'Tutoreo I',
    evaluationScore: 9.0,
  }
];

const EvaluationDashboard = ({ department, period }: { department: string; period: string }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const departmentProfessors = professors.filter(p => p.department === department);
  const topProfessors = [...departmentProfessors]
    .sort((a, b) => (b.evaluationScore || 0) - (a.evaluationScore || 0))
    .slice(0, 3);
  
  const departmentAverage = departmentProfessors.reduce((acc, prof) => acc + (prof.evaluationScore || 0), 0) / departmentProfessors.length;

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % mockQuestionResults.length);
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev - 1 + mockQuestionResults.length) % mockQuestionResults.length);
  };

  const currentQuestion = mockQuestionResults[currentQuestionIndex];

  const chartData = {
    labels: currentQuestion.responses.map((_, i) => `Grupo ${String.fromCharCode(65 + i)}`),
    datasets: [
      {
        label: 'Calificación',
        data: currentQuestion.responses,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Promedio del Departamento</h3>
          <p className="text-3xl font-bold text-blue-600">{departmentAverage.toFixed(1)}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Periodo</h3>
          <p className="text-xl">{period}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Resultados por Pregunta</h3>
          <div className="flex space-x-2">
            <button
              onClick={handlePrevQuestion}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              ←
            </button>
            <button
              onClick={handleNextQuestion}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              →
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600">{currentQuestion.question}</p>
          <p className="text-xl font-semibold mt-2">
            Promedio: {currentQuestion.averageScore.toFixed(1)}
          </p>
        </div>
        
        <div className="h-64">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 10,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

const DepartamentosDashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(periods[0]);

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
      <div className="p-6 h-full bg-gradient-to-br from-blue-50 to-purple-50">
        <button
          onClick={handleBackClick}
          className="mb-6 px-4 py-2 bg-white/50 backdrop-blur-sm text-gray-700 font-bold rounded-lg hover:bg-white/70 transition duration-150 ease-in-out border border-white/30"
        >
          ← Volver
        </button>

        <div className="bg-white/30 backdrop-blur-lg p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">{selectedProfessor.name}</h1>
          
          <div className="space-y-4">
            <div className="bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/30">
              <h2 className="text-sm font-medium text-gray-500">Matrícula</h2>
              <p className="text-lg text-gray-800">{selectedProfessor.matricula}</p>
            </div>
            
            <div className="bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/30">
              <h2 className="text-sm font-medium text-gray-500">Departamento</h2>
              <p className="text-lg text-gray-800">{selectedProfessor.department}</p>
            </div>
            
            <div className="bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/30">
              <h2 className="text-sm font-medium text-gray-500">Materia</h2>
              <p className="text-lg text-gray-800">{selectedProfessor.subject}</p>
            </div>
            
            <div className="bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/30">
              <h2 className="text-sm font-medium text-gray-500">Resultados de Evaluaciones</h2>
              <div className="mt-2">
                <EvaluationDashboard 
                  department={selectedProfessor.department} 
                  period={selectedPeriod}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full bg-gradient-to-br from-blue-50 to-purple-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Departamentos</h1>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
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

        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:border-blue-500/50 transition duration-150"
        >
          {periods.map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </select>
      </div>

      {selectedDepartment && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Profesores de {selectedDepartment}
            </h2>
          </div>
          <div className="space-y-4">
            {filteredProfessors.length > 0 ? (
              filteredProfessors.map((professor) => (
                <div
                  key={professor.id}
                  onClick={() => handleProfessorClick(professor)}
                  className="bg-white/30 backdrop-blur-lg p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-200 cursor-pointer"
                >
                  <h3 className="font-medium text-gray-800">{professor.name}</h3>
                  <p className="text-sm text-gray-600">
                    Matrícula: {professor.matricula}
                  </p>
                  <p className="text-sm text-gray-600">
                    Materia: {professor.subject}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-white/30 backdrop-blur-lg p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 text-center">
                <p className="text-gray-600">No hay profesores registrados en este departamento</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartamentosDashboard; 