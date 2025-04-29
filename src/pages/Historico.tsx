import React from 'react';
import HistoricoDashboard from './HistoricoDashboard';

interface HistoricoProps {
  onNavigate: (screen: string) => void;
}

const Historico: React.FC<HistoricoProps> = ({ onNavigate }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Histórico de Evaluaciones</h1>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          onClick={() => onNavigate('Subir Excel')}
        >
          Subir Excel
        </button>
      </div>
      <HistoricoDashboard />
    </div>
  );
};

export default Historico; 