import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Pregunta {
  pregunta: string;
  promedioGeneral: number;
  promediosPorGrupo: { [grupo: string]: number };
}

interface Profesor {
  profesor: string;
  materia: string;
  grupos: string[];
  preguntas: Pregunta[];
}

const modulos = [
  { label: 'Académico', value: 'academico' },
  { label: 'Cultural', value: 'cultural' },
  { label: 'Deportivo', value: 'deportivo' },
  { label: 'Laboratoristas', value: 'laboratoristas' },
  { label: 'Tutoreo', value: 'tutoreo' }
];

const ResultadosDashboard = () => {
  const [modulo, setModulo] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [disponibles, setDisponibles] = useState<{ [year: string]: string[] }>({});
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [currentProfessorIndex, setCurrentProfessorIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [promedioDepto, setPromedioDepto] = useState<number>(0);

  const isCultural = modulo === 'cultural' || modulo === 'deportivo';

  useEffect(() => {
    if (!modulo) return;
    axios.get(`/${modulo}/disponibles`).then(res => {
      setDisponibles(res.data);
      setPeriodo('');
      setProfesores([]);
    });
  }, [modulo]);

  useEffect(() => {
    if (!modulo || !periodo) return;
    const [year, periodoTexto] = periodo.split('_');

    axios.get(`/${modulo}/resultados`, {
      params: { year, periodo: periodoTexto }
    }).then(res => {
      setProfesores(res.data.profesores || []);
      setPromedioDepto(parseFloat(res.data.promedioDepartamento) || 0);
      setCurrentProfessorIndex(0);
      setCurrentQuestionIndex(0);
    });
  }, [modulo, periodo]);

  const currentProfessor = profesores[currentProfessorIndex] || null;
  const currentQuestion = currentProfessor?.preguntas[currentQuestionIndex] || null;
  const grupos = currentProfessor?.grupos || [];

  const chartLabels = [...grupos, 'Promedio'];
  const chartValues = [
    ...grupos.map(grupo => currentQuestion?.promediosPorGrupo?.[grupo] ?? 0),
    currentQuestion?.promedioGeneral ?? 0
  ];

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Promedio por grupo',
        data: chartValues,
        backgroundColor: chartLabels.map(label =>
          label === 'Promedio' ? 'rgba(34, 197, 94, 0.5)' : 'rgba(59, 130, 246, 0.5)'
        ),
        borderColor: chartLabels.map(label =>
          label === 'Promedio' ? 'rgb(34, 197, 94)' : 'rgb(59, 130, 246)'
        ),
        borderWidth: 1,
      }
    ]
  };

  const barChartCulturalData = {
    labels: [...(currentProfessor?.preguntas.map(p => p.pregunta) || []), 'Promedio General'],
    datasets: [
      {
        label: 'Promedio por pregunta',
        data: [
          ...(currentProfessor?.preguntas.map(p => p.promedioGeneral) || []),
          promedioDepto
        ],
        backgroundColor: [
          ...Array(currentProfessor?.preguntas.length || 0).fill('rgba(59, 130, 246, 0.5)'),
          'rgba(34, 197, 94, 0.5)'
        ],
        borderColor: [
          ...Array(currentProfessor?.preguntas.length || 0).fill('rgb(59, 130, 246)'),
          'rgb(34, 197, 94)'
        ],
        borderWidth: 1
      }
    ]
  };

  const nextProfessor = () => {
    setCurrentProfessorIndex((prev) => (prev + 1) % profesores.length);
    setCurrentQuestionIndex(0);
  };

  const prevProfessor = () => {
    setCurrentProfessorIndex((prev) => (prev - 1 + profesores.length) % profesores.length);
    setCurrentQuestionIndex(0);
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) =>
      currentProfessor ? (prev + 1) % currentProfessor.preguntas.length : 0
    );
  };

  const prevQuestion = () => {
    setCurrentQuestionIndex((prev) =>
      currentProfessor
        ? (prev - 1 + currentProfessor.preguntas.length) % currentProfessor.preguntas.length
        : 0
    );
  };

  return (
    <div className="p-6 h-full bg-gradient-to-br from-blue-50 to-purple-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Resultados de Evaluaciones</h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <select
          value={modulo}
          onChange={(e) => setModulo(e.target.value)}
          className="px-4 py-2 bg-white/50 border border-white/30 rounded-lg"
        >
          <option value="">Selecciona un módulo</option>
          {modulos.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>

        <select
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          className="px-4 py-2 bg-white/50 border border-white/30 rounded-lg"
        >
          <option value="">Selecciona un periodo</option>
          {Object.entries(disponibles).map(([year, periodos]) =>
            periodos.map(p => (
              <option key={`${year}_${p}`} value={`${year}_${p}`}>{`${year}_${p}`}</option>
            ))
          )}
        </select>
      </div>

      {currentProfessor ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/30 p-4 rounded-2xl border border-white/20 text-center">
              <h3 className="text-lg font-semibold text-gray-800">Promedio del Departamento</h3>
              <p className="text-3xl font-bold text-blue-600">{promedioDepto.toFixed(1)}</p>
            </div>

            <div className="bg-white/30 p-4 rounded-2xl border border-white/20 text-center">
              <h3 className="text-lg font-semibold text-gray-800">Profesor Seleccionado</h3>
              <p className="text-xl font-medium">{currentProfessor.profesor}</p>
              <p className="text-sm text-gray-600">{currentProfessor.materia}</p>
              <div className="mt-2 flex justify-center gap-2">
                <button onClick={prevProfessor} className="px-3 py-1 bg-gray-100 rounded">←</button>
                <button onClick={nextProfessor} className="px-3 py-1 bg-gray-100 rounded">→</button>
              </div>
            </div>

            <div className="bg-white/30 p-4 rounded-2xl border border-white/20 text-center">
              <h3 className="text-lg font-semibold text-gray-800">Periodo</h3>
              <p className="text-xl text-gray-700">{periodo}</p>
            </div>
          </div>

          <div className="bg-white/30 p-4 rounded-2xl border border-white/20">
            {isCultural ? (
              <div className="h-96">
                <Bar
                  data={barChartCulturalData}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true, max: 10 },
                      x: {}
                    }
                  }}
                />
              </div>
            ) : currentQuestion ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Resultados por Pregunta</h3>
                  <div className="flex space-x-2">
                    <button onClick={prevQuestion} className="px-4 py-2 bg-gray-100 rounded">Anterior</button>
                    <button onClick={nextQuestion} className="px-4 py-2 bg-gray-100 rounded">Siguiente</button>
                  </div>
                </div>
                <div className="bg-white/40 p-4 rounded-xl border border-white/30">
                  <h4 className="text-gray-800 font-medium mb-4">{currentQuestion.pregunta}</h4>
                  <div className="h-64">
                    <Bar
                      data={chartData}
                      options={{
                        maintainAspectRatio: false,
                        responsive: true,
                        plugins: { legend: { display: false } },
                        scales: {
                          y: { beginAtZero: true, max: 10 },
                          x: {}
                        }
                      }}
                    />
                  </div>
                  <div className="mt-4 text-center text-gray-700 space-y-1">
                    {grupos.map(grupo => (
                      <p key={grupo}>
                        Grupo <strong>{grupo}</strong>: <strong>{(currentQuestion.promediosPorGrupo[grupo] ?? 'N/A').toFixed?.(1) || 'N/A'}</strong>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="bg-white/30 p-8 rounded-2xl border border-white/20 text-center">
          <p className="text-gray-700">Selecciona un módulo y un periodo para ver los resultados</p>
        </div>
      )}
    </div>
  );
};

export default ResultadosDashboard;
