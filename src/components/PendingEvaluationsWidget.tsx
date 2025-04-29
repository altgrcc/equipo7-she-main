import { FC } from 'react';
import { HiClipboardList } from 'react-icons/hi';

interface ExpectedEvaluationsWidgetProps {
    expectedCount?: number;
    lastUpdated: Date;
}

const ExpectedEvaluationsWidget: FC<ExpectedEvaluationsWidgetProps> = ({ expectedCount = 402, lastUpdated }) => {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
                <div className="bg-[#caf9f8] p-3 rounded-full mr-4 border border-[#caf9f8]">
                    <HiClipboardList className="text-[#09acac] text-2xl" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Evaluaciones Esperadas</h3>
                    <p className="text-sm text-gray-500">Total de estudiantes esperados</p>
                </div>
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-3xl font-bold text-[#09acac]">{expectedCount}</p>
                    <p className="text-sm text-gray-500">estudiantes deben responder</p>
                </div>
                <p className="text-xs text-gray-400">
                    Actualizado: {formatDate(lastUpdated)}
                </p>
            </div>
        </div>
    );
};

export default ExpectedEvaluationsWidget; 