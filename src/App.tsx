// src/App.tsx
import { useState, useEffect } from 'react';
import Sidebar, { SidebarItem } from "./components/Sidebar";
import { HiOutlineHome, HiUserGroup, HiUser, HiViewGrid, HiClipboardList, HiDocumentText, HiPlusCircle, HiChartBar, HiOutlineTemplate } from "react-icons/hi";
import Login from "./components/Login";
import UsuariosDashboard from "./pages/UsuariosDashboard";
import ProfesoresDashboard from "./pages/ProfesoresDashboard";
import NuevaEncuesta from "./pages/NuevaEncuesta";
import Historico from "./pages/Historico";
import SubirExcel from "./pages/SubirExcel";
import DepartamentosDashboard from "./pages/DepartamentosDashboard";
import ProfesorDetalles from "./pages/ProfesorDetalles";

import HomePage from "./pages/homepage";
import ResultadosDashboard from "./pages/ResultadosDashboard";

function getRandomPercent() {
  // Returns a random percent string between 20% and 80%
  return Math.floor(20 + Math.random() * 60) + '%';
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState('Home');
  const [gradientCenter, setGradientCenter] = useState({ x: '50%', y: '50%' });

  useEffect(() => {
    console.log('Selected Screen changed:', selectedScreen);
  }, [selectedScreen]);

  useEffect(() => {
    // Set a random center for the gradient on mount
    setGradientCenter({ x: getRandomPercent(), y: getRandomPercent() });
  }, []);

  const handleLogin = () => {
    // Here you would typically validate credentials with your backend
    // For now, we'll just set isAuthenticated to true
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedScreen('Home');
  };

  const handleScreenChange = (screen: string) => {
    console.log('Changing screen to:', screen);
    setSelectedScreen(screen);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  let mainContent = null;
  console.log('Rendering screen:', selectedScreen);
  
  switch (selectedScreen) {
    case 'Home':
      mainContent = <HomePage />;
      break;
    case 'Usuarios':
      mainContent = <UsuariosDashboard />;
      break;
    case 'Profesores':
      mainContent = <ProfesoresDashboard />;
      break;
    case 'Nueva Encuesta':
      mainContent = <NuevaEncuesta />;
      break;
    case 'Histórico':
      mainContent = <Historico onNavigate={setSelectedScreen} />;
      break;
    case 'Subir Excel':
      mainContent = <SubirExcel />;
      break;
    case 'Departamentos':
      mainContent = <DepartamentosDashboard />;
      break;
    case 'Profesor':
      mainContent = <ProfesorDetalles />;
      break;
    case 'Resultados':
      mainContent = <ResultadosDashboard />;
      break;
    default:
      mainContent = <HomePage />;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        minWidth: '100vw',
        position: 'relative',
        background: `conic-gradient(at ${gradientCenter.x} ${gradientCenter.y}, #59C3C3 0%, #CAD2C5 20%, #84A98C 40%, #2836F6 60%, #EBEBEB 80%, #59C3C3 100%)`
      }}
    >
      <div className="flex h-screen" style={{ background: 'transparent' }}>
        <Sidebar onLogout={handleLogout}>
          <SidebarItem icon={<HiOutlineHome size={22} />} text="Home" active={selectedScreen === 'Home'} onClick={() => handleScreenChange('Home')} />
          <SidebarItem icon={<HiUserGroup size={22} />} text="Usuarios" active={selectedScreen === 'Usuarios'} onClick={() => handleScreenChange('Usuarios')} />
          <SidebarItem icon={<HiUser size={22} />} text="Profesores" active={selectedScreen === 'Profesores'} onClick={() => handleScreenChange('Profesores')} />
          <SidebarItem icon={<HiViewGrid size={22} />} text="Departamentos" active={selectedScreen === 'Departamentos'} onClick={() => handleScreenChange('Departamentos')} />
          <SidebarItem icon={<HiClipboardList size={22} />} text="Evaluaciones" active={selectedScreen === 'Evaluaciones'} onClick={() => handleScreenChange('Evaluaciones')} />
          <SidebarItem icon={<HiDocumentText size={22} />} text="Histórico" active={selectedScreen === 'Histórico'} onClick={() => handleScreenChange('Histórico')} />
          <SidebarItem icon={<HiChartBar size={22} />} text="Resultados" active={selectedScreen === 'Resultados'} onClick={() => handleScreenChange('Resultados')} />
          <SidebarItem icon={<HiOutlineTemplate size={22} />} text="Nueva Encuesta" active={selectedScreen === 'Nueva Encuesta'} onClick={() => handleScreenChange('Nueva Encuesta')} />
        </Sidebar>

        <main className="flex-1 overflow-auto bg-transparent">
          {mainContent}
        </main>
      </div>
    </div>
  );
}

export default App;

