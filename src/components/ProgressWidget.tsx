import { FC } from 'react';
import { HiChartBar } from 'react-icons/hi';

interface DepartmentProgress {
    name: string;
    totalExpected: number;
    received: number;
}

interface ProgressWidgetProps {
    departments: DepartmentProgress[];
    lastUpdated: Date;
}

const ProgressWidget: FC<ProgressWidgetProps> = ({ departments, lastUpdated }) => {
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
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 col-span-2">
            <div className="flex items-center mb-6">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                    <HiChartBar className="text-green-600 text-2xl" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Progreso por Departamento</h3>
                    <p className="text-sm text-gray-500">Estado de las evaluaciones por departamento</p>
                </div>
            </div>

            <div className="space-y-4">
                {departments.map((dept) => {
                    const percentage = Math.round((dept.received / dept.totalExpected) * 100);
                    const remaining = dept.totalExpected - dept.received;

                    return (
                        <div key={dept.name} className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                                <span className="text-sm font-medium text-gray-700">{percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                    className="bg-green-600 h-3 rounded-full transition-all duration-500 ease-in-out"
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-500">{dept.received} recibidas</span>
                                <span className="text-xs text-gray-500">{remaining} pendientes</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <p className="text-xs text-gray-400 mt-4">
                Actualizado: {formatDate(lastUpdated)}
            </p>
        </div>
    );
};

export default ProgressWidget; 