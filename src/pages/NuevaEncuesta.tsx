import React, { useState } from 'react';

const NuevaEncuesta: React.FC = () => {
  const [questions, setQuestions] = useState(Array.from({ length: 5 }, (_, i) => i + 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy submit function
    alert('Encuesta enviada exitosamente!');
  };

  const addQuestion = () => {
    if (questions.length < 12) {
      setQuestions([...questions, questions.length + 1]);
    }
  };

  const deleteQuestion = (questionNumber: number) => {
    if (questions.length > 5) {
      setQuestions(questions.filter(q => q !== questionNumber));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Nueva Encuesta</h2>
        {questions.length < 12 && (
          <button
            onClick={addQuestion}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            + Añadir Pregunta
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="max-h-[600px] overflow-y-auto pr-4">
          {questions.map((questionNumber) => (
            <div key={questionNumber} className="mb-6 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Pregunta {questionNumber}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder={`Ingrese la pregunta ${questionNumber}`}
                />
                {questions.length > 5 && (
                  <button
                    type="button"
                    onClick={() => deleteQuestion(questionNumber)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    ×
                  </button>
                )}
              </div>
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