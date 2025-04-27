import React from 'react';

const NuevaEncuesta: React.FC = () => {
  const questions = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy submit function
    alert('Encuesta enviada exitosamente!');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Nueva Encuesta</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="max-h-[600px] overflow-y-auto pr-4">
          {questions.map((questionNumber) => (
            <div key={questionNumber} className="mb-6">
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
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Subir Encuesta
          </button>
        </div>
      </form>
    </div>
  );
};

export default NuevaEncuesta; 