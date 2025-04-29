import React, { useState } from 'react';

const NuevaEncuesta: React.FC = () => {
  const [questions, setQuestions] = useState(Array.from({ length: 5 }, (_, i) => i + 1));
  const [formData, setFormData] = useState({
    periodo: '',
    año: '',
    departamento: '',
    materia: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy submit function
    alert('Encuesta enviada exitosamente!');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addQuestion = () => {
    if (questions.length < 12) {
      setQuestions([...questions, questions.length + 1]);
    }
  };

  const deleteLastQuestion = () => {
    if (questions.length > 5) {
      setQuestions(questions.slice(0, -1));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Nueva Encuesta</h2>
          <div className="flex justify-center gap-4 mt-4">
            {questions.length > 5 && (
              <button
                type="button"
                onClick={deleteLastQuestion}
                className="bg-red-500/80 hover:bg-red-600/80 backdrop-blur-sm text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out border border-red-500/20"
              >
                - Borrar Última Pregunta
              </button>
            )}
            {questions.length < 12 && (
              <button
                onClick={addQuestion}
                className="bg-green-500/80 hover:bg-green-600/80 backdrop-blur-sm text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out border border-green-500/20"
              >
                + Añadir Pregunta
              </button>
            )}
          </div>
        </div>

        <div className="bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              {questions.map((questionNumber) => (
                <div key={questionNumber} className="bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/30">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Pregunta {questionNumber}
                  </label>
                  <input
                    type="text"
                    className="bg-white/50 backdrop-blur-sm shadow appearance-none border border-white/30 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500/50 transition duration-150"
                    placeholder={`Ingrese la pregunta ${questionNumber}`}
                  />
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/30">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Período
                </label>
                <select
                  name="periodo"
                  value={formData.periodo}
                  onChange={handleInputChange}
                  className="bg-white/50 backdrop-blur-sm shadow appearance-none border border-white/30 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500/50 transition duration-150"
                >
                  <option value="">Seleccione un período</option>
                  <option value="Primavera">Primavera</option>
                  <option value="Verano">Verano</option>
                  <option value="Otoño">Otoño</option>
                </select>
              </div>

              <div className="bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/30">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Año
                </label>
                <input
                  type="number"
                  name="año"
                  value={formData.año}
                  onChange={handleInputChange}
                  className="bg-white/50 backdrop-blur-sm shadow appearance-none border border-white/30 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500/50 transition duration-150"
                  placeholder="Ej: 2024"
                  min="2000"
                  max="2100"
                />
              </div>

              <div className="bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/30">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Departamento
                </label>
                <input
                  type="text"
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleInputChange}
                  className="bg-white/50 backdrop-blur-sm shadow appearance-none border border-white/30 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500/50 transition duration-150"
                  placeholder="Ingrese el departamento"
                />
              </div>

              <div className="bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/30">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Materia
                </label>
                <input
                  type="text"
                  name="materia"
                  value={formData.materia}
                  onChange={handleInputChange}
                  className="bg-white/50 backdrop-blur-sm shadow appearance-none border border-white/30 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500/50 transition duration-150"
                  placeholder="Ingrese la materia"
                />
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="bg-blue-500/80 hover:bg-blue-600/80 backdrop-blur-sm text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out border border-blue-500/20"
              >
                Subir Encuesta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NuevaEncuesta; 