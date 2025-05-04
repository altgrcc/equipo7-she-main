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
import EvaluacionesDashboard from "./pages/EvaluacionesDashboard";

import HomePage from "./pages/homepage";
import ResultadosDashboard from "./pages/ResultadosDashboard";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState('Home');

  useEffect(() => {
    console.log('Selected Screen changed:', selectedScreen);
  }, [selectedScreen]);

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
    case 'Evaluaciones':
      mainContent = <EvaluacionesDashboard />;
      break;
    default:
      mainContent = <HomePage />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      minWidth: '100vw',
      position: 'relative',
      background: 'radial-gradient(circle at 20% 40%, #BAD4FF 0%, #EBEBEB 80%)',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        background: 'linear-gradient(to right, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0) 60%)'
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        filter: 'blur(32px)'
      }} />
      <div className="flex h-screen relative z-10">
        <Sidebar onLogout={handleLogout}>
          <SidebarItem icon={<HiOutlineHome size={22} />} text="Home" active={selectedScreen === 'Home'} onClick={() => handleScreenChange('Home')} />
          <SidebarItem icon={<HiUserGroup size={22} />} text="Usuarios" active={selectedScreen === 'Usuarios'} onClick={() => handleScreenChange('Usuarios')} />
          <SidebarItem icon={<HiOutlineTemplate size={22} />} text="Nueva Encuesta" active={selectedScreen === 'Nueva Encuesta'} onClick={() => handleScreenChange('Nueva Encuesta')} /> 
          <SidebarItem icon={<HiDocumentText size={22} />} text="Histórico" active={selectedScreen === 'Histórico'} onClick={() => handleScreenChange('Histórico')} />          
          <SidebarItem icon={<HiChartBar size={22} />} text="Resultados" active={selectedScreen === 'Resultados'} onClick={() => handleScreenChange('Resultados')} />          
          <SidebarItem icon={<HiViewGrid size={22} />} text="Departamentos" active={selectedScreen === 'Departamentos'} onClick={() => handleScreenChange('Departamentos')} />                   
          <SidebarItem icon={<HiUser size={22} />} text="Profesores" active={selectedScreen === 'Profesores'} onClick={() => handleScreenChange('Profesores')} />
          <SidebarItem icon={<HiClipboardList size={22} />} text="Evaluaciones" active={selectedScreen === 'Evaluaciones'} onClick={() => handleScreenChange('Evaluaciones')} />
        </Sidebar>
        <main className="flex-1 overflow-auto bg-transparent">
          {mainContent}
        </main>
      </div>
    </div>
  );
}

export default App;

