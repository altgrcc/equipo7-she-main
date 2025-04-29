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

interface QuestionResult {
  question: string;
  averageScore: number;
  responses: number[];
}

interface Professor {
  id: string;
  name: string;
  matricula: string;
  department: string;
  subject: string;
  evaluationScore?: number;
}

const departments = [
  'Ciencias Básicas',
  'Ingeniería Civil',
  'Ingeniería Industrial',
  'Ingeniería Mecánica',
  'Ingeniería Eléctrica',
  'Ingeniería en Sistemas',
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
    department: 'Ciencias Básicas',
    subject: 'Matemáticas',
    evaluationScore: 9.2,
  },
  {
    id: '2',
    name: 'María García',
    matricula: '67890',
    department: 'Ingeniería Civil',
    subject: 'Estructuras',
    evaluationScore: 8.8,
  },
  {
    id: '3',
    name: 'Carlos López',
    matricula: '54321',
    department: 'Ingeniería Industrial',
    subject: 'Procesos',
    evaluationScore: 8.5,
  },
  {
    id: '4',
    name: 'Ana Martínez',
    matricula: '98765',
    department: 'Ingeniería Mecánica',
    subject: 'Termodinámica',
    evaluationScore: 9.0,
  },
];

const ResultadosDashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>(periods[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const departmentProfessors = professors.filter(p => p.department === selectedDepartment);
  const topProfessors = [...departmentProfessors]
    .sort((a, b) => (b.evaluationScore || 0) - (a.evaluationScore || 0))
    .slice(0, 3);
  
  const departmentAverage = departmentProfessors.reduce((acc, prof) => acc + (prof.evaluationScore || 0), 0) / departmentProfessors.length || 0;

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
    <div className="p-6 h-full bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Resultados de Evaluaciones</h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="px-4 py-2 border rounded-lg"
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
          className="px-4 py-2 border rounded-lg"
        >
          {periods.map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </select>
      </div>

      {selectedDepartment ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Promedio del Departamento</h3>
              <p className="text-3xl font-bold text-blue-600">{departmentAverage.toFixed(1)}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Top Profesores</h3>
              <div className="space-y-2">
                {topProfessors.map((prof, index) => (
                  <div key={prof.id} className="flex justify-between items-center">
                    <span>{index + 1}. {prof.name}</span>
                    <span className="font-semibold">{prof.evaluationScore?.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Periodo</h3>
              <p className="text-xl">{selectedPeriod}</p>
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
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">Selecciona un departamento para ver los resultados</p>
        </div>
      )}
    </div>
  );
};

export default ResultadosDashboard; 