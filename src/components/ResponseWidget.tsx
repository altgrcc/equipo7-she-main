import { FC } from 'react';
import { HiDocumentText } from 'react-icons/hi';

interface ResponseWidgetProps {
    totalResponses: number;
    lastUpdated: Date;
}

const ResponseWidget: FC<ResponseWidgetProps> = ({ totalResponses, lastUpdated }) => {
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
            <div className="bg-indigo-100 p-3 rounded-full mr-4">
            <HiDocumentText className="text-indigo-600 text-2xl" />
            </div>
            <div>
            <h3 className="text-lg font-semibold text-gray-800">Respuestas Totales</h3>
            <p className="text-sm text-gray-500">Última actualización</p>
            </div>
        </div>
        <div className="flex items-end justify-between">
            <div>
            <p className="text-3xl font-bold text-indigo-600">{totalResponses}</p>
            <p className="text-sm text-gray-500">respuestas recibidas</p>
            </div>
            <p className="text-xs text-gray-400">
            Actualizado: {formatDate(lastUpdated)}
            </p>
        </div>
        </div>
    );
};

export default ResponseWidget; 