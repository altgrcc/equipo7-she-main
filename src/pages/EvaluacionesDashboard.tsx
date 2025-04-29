import { useState, useEffect } from 'react';
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
import { HiSparkles } from 'react-icons/hi';

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

// Mock data for groups
const groups = [
  '1A', '1B', '1C', '2A', '2B', '2C', '3A', '3B', '3C',
  '4A', '4B', '4C', '5A', '5B', '5C', '6A', '6B', '6C'
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

const getInsightMessage = (question: string, score: number): string => {
  if (score >= 9) {
    return "¡Excelente desempeño! Los estudiantes están muy satisfechos con este aspecto.";
  } else if (score >= 8) {
    return "Buen desempeño, pero hay margen para mejorar. Considera revisar las áreas de oportunidad.";
  } else if (score >= 7) {
    return "Desempeño aceptable, pero se recomienda implementar estrategias de mejora.";
  } else if (score >= 6) {
    return "Necesita atención inmediata. Se recomienda revisar y mejorar este aspecto.";
  } else {
    return "Requiere intervención urgente. Se sugiere implementar un plan de mejora integral.";
  }
};

const EvaluacionesDashboard = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>(periods[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoadingInsight, setIsLoadingInsight] = useState(true);
  const [insightMessage, setInsightMessage] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (selectedGroup) {
      setIsLoadingInsight(true);
      setDisplayedText('');
      setCurrentIndex(0);
      
      // Simular carga de insight
      setTimeout(() => {
        const currentQuestion = mockQuestionResults[currentQuestionIndex];
        setInsightMessage(getInsightMessage(currentQuestion.question, currentQuestion.averageScore));
        setIsLoadingInsight(false);
      }, 1500);
    }
  }, [selectedGroup, currentQuestionIndex]);

  useEffect(() => {
    if (!isLoadingInsight && insightMessage && currentIndex < insightMessage.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + insightMessage[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 10); // Reducido a 10ms para mayor velocidad

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, insightMessage, isLoadingInsight]);

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % mockQuestionResults.length);
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev - 1 + mockQuestionResults.length) % mockQuestionResults.length);
  };

  const currentQuestion = mockQuestionResults[currentQuestionIndex];

  const chartData = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    datasets: [
      {
        label: 'Número de respuestas',
        data: currentQuestion.responses,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 h-full bg-gradient-to-br from-blue-50 to-purple-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Evaluaciones por Grupo</h1>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="px-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:border-blue-500/50 transition duration-150"
        >
          <option value="">Selecciona un grupo</option>
          {groups.map((group) => (
            <option key={group} value={group}>
              {group}
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

      {selectedGroup ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/30 backdrop-blur-lg p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-200">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Grupo</h3>
              <p className="text-3xl font-bold text-blue-600">{selectedGroup}</p>
            </div>
            
            <div className="bg-white/30 backdrop-blur-lg p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-200">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Periodo</h3>
              <p className="text-xl text-gray-700">{selectedPeriod}</p>
            </div>

            {/* Widget de Insights */}
            <div className="bg-white/30 backdrop-blur-lg p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-200">
              <div className="flex items-center mb-4">
                <HiSparkles className="text-purple-500 text-2xl mr-2" />
                <h3 className="text-lg font-semibold text-purple-500">Insight</h3>
              </div>
              
              {isLoadingInsight ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-pulse h-4 w-4 bg-purple-200 rounded-full"></div>
                  <div className="animate-pulse h-4 w-4 bg-purple-200 rounded-full delay-100"></div>
                  <div className="animate-pulse h-4 w-4 bg-purple-200 rounded-full delay-200"></div>
                  <span className="text-gray-500 ml-2">Generando insight...</span>
                </div>
              ) : (
                <div className="bg-purple-100/70 backdrop-blur-sm p-4 rounded-lg border border-purple-200/50">
                  <p className="text-gray-700">
                    {displayedText}
                    {currentIndex < insightMessage.length && <span className="animate-blink">|</span>}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/30 backdrop-blur-lg p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Resultados por Pregunta</h3>
              <div className="flex space-x-2">
                <button
                  onClick={handlePrevQuestion}
                  className="bg-white/50 hover:bg-white/70 backdrop-blur-sm text-gray-700 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out border border-white/30"
                >
                  Anterior
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="bg-white/50 hover:bg-white/70 backdrop-blur-sm text-gray-700 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out border border-white/30"
                >
                  Siguiente
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600">{currentQuestion.question}</p>
              <p className="text-xl font-semibold mt-2 text-gray-800">
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
                      title: {
                        display: true,
                        text: 'Número de respuestas'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Calificación (1-10)'
                      }
                    }
                  },
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white/30 backdrop-blur-lg p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 text-center">
          <p className="text-gray-600">Selecciona un grupo para ver los resultados</p>
        </div>
      )}
    </div>
  );
};

export default EvaluacionesDashboard; 