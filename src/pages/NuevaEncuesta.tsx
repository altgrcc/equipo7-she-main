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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Nueva Encuesta</h2>
          <div className="flex justify-center gap-4 mt-4">
            {questions.length > 5 && (
              <button
                type="button"
                onClick={deleteLastQuestion}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              >
                - Borrar Última Pregunta
              </button>
            )}
            {questions.length < 12 && (
              <button
                onClick={addQuestion}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              >
                + Añadir Pregunta
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              {questions.map((questionNumber) => (
                <div key={questionNumber} className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Pregunta {questionNumber}
                  </label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder={`Ingrese la pregunta ${questionNumber}`}
                  />
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Período
                </label>
                <select
                  name="periodo"
                  value={formData.periodo}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Seleccione un período</option>
                  <option value="Primavera">Primavera</option>
                  <option value="Verano">Verano</option>
                  <option value="Otoño">Otoño</option>
                </select>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Año
                </label>
                <input
                  type="number"
                  name="año"
                  value={formData.año}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Ej: 2024"
                  min="2000"
                  max="2100"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Departamento
                </label>
                <input
                  type="text"
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Ingrese el departamento"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Materia
                </label>
                <input
                  type="text"
                  name="materia"
                  value={formData.materia}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Ingrese la materia"
                />
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
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