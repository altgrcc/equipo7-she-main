import { FC, useState, useEffect } from 'react';
import ResponseWidget from '../components/ResponseWidget';
import PendingEvaluationsWidget from '../components/PendingEvaluationsWidget';
import ProgressWidget from '../components/ProgressWidget';

const HomePage: FC = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const userName = "John Doe";

    const departments = [
        {
        name: "Académico",
        totalExpected: 120,
        received: 115
        },
        {
        name: "Extraacadémico Deportivo",
        totalExpected: 85,
        received: 80
        },
        {
        name: "Extraacadémico Cultural",
        totalExpected: 60,
        received: 55
        },
        {
        name: "Laboratorista",
        totalExpected: 50,
        received: 50
        },
        {
        name: "Tutoreo",
        totalExpected: 45,
        received: 40
        }
    ];

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div 
        className="min-h-screen relative overflow-hidden"
        style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, #2836F6/5 0%, white 50%, #2836F6/5 100%)`
        }}
        >
        <div className="relative z-10 p-6">
            <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#000000] mb-3">
                ¡Bienvenido, {userName}!
            </h1>
            <p className="text-gray-600 text-lg">
                Estamos encantados de tenerte aquí. ¿En qué podemos ayudarte hoy?
            </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ResponseWidget 
                totalResponses={300}
                lastUpdated={new Date()}
            />
            <PendingEvaluationsWidget
                pendingCount={15}
                lastUpdated={new Date()}
            />
            <ProgressWidget
                departments={departments}
                lastUpdated={new Date()}
            />
            </div>
        </div>
        </div>
    );
};

export default HomePage; 