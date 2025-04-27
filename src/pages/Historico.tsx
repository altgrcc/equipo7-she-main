import React from 'react';

interface HistoricoProps {
  onNavigate: (screen: string) => void;
}

const Historico: React.FC<HistoricoProps> = ({ onNavigate }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Histórico</h1>
      <div className="flex flex-col space-y-4 max-w-md">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          onClick={() => {
            // TODO: Implementar funcionalidad de ver histórico
            alert('Funcionalidad de ver histórico en desarrollo');
          }}
        >
          Ver Histórico
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          onClick={() => onNavigate('Subir Excel')}
        >
          Subir Excel
        </button>
      </div>
    </div>
  );
};

export default Historico; 