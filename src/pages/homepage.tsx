import { FC } from 'react';
import ResponseWidget from '../components/ResponseWidget';
import PendingEvaluationsWidget from '../components/PendingEvaluationsWidget';
import ProgressWidget from '../components/ProgressWidget';

const HomePage: FC = () => {
  // This would typically come from your authentication system
  const userName = "John Doe"; // Replace this with actual user data from your auth system

  const departments = [
    {
      name: "Ingeniería",
      totalExpected: 120,
      received: 115
    },
    {
      name: "Ciencias",
      totalExpected: 85,
      received: 80
    },
    {
      name: "Humanidades",
      totalExpected: 60,
      received: 55
    },
    {
      name: "Arquitectura",
      totalExpected: 50,
      received: 50
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          ¡Bienvenido, {userName}!
        </h1>
        <p className="text-gray-600">
          Estamos encantados de tenerte aquí. ¿En qué podemos ayudarte hoy?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
};

export default HomePage; 