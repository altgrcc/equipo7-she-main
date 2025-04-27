// src/App.tsx
import { useState } from 'react';
import Sidebar, { SidebarItem } from "./components/Sidebar";
import { HiOutlineHome, HiUserGroup, HiUser, HiViewGrid, HiClipboardList, HiDocumentText, HiPlusCircle, HiChartBar, HiOutlineTemplate } from "react-icons/hi";
import Login from "./components/Login";
import UsuariosDashboard from "./pages/UsuariosDashboard";
import NuevaEncuesta from "./pages/NuevaEncuesta";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState('Home');

  const handleLogin = () => {
    // Here you would typically validate credentials with your backend
    // For now, we'll just set isAuthenticated to true
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedScreen('Home');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  let mainContent = null;
  if (selectedScreen === 'Usuarios') {
    mainContent = <UsuariosDashboard />;
  } else if (selectedScreen === 'Nueva Encuesta') {
    mainContent = <NuevaEncuesta />;
  } else {
    mainContent = <h1 className="text-2xl font-bold mb-4">Contenido principal aquí</h1>;
  }

  return (
    <div className="flex">
      <Sidebar onLogout={handleLogout}>
        <SidebarItem icon={<HiOutlineHome size={22} />} text="Home" active={selectedScreen === 'Home'} onClick={() => setSelectedScreen('Home')} />
        <SidebarItem icon={<HiUserGroup size={22} />} text="Usuarios" active={selectedScreen === 'Usuarios'} onClick={() => setSelectedScreen('Usuarios')} />
        <SidebarItem icon={<HiUser size={22} />} text="Profesores" active={selectedScreen === 'Profesores'} onClick={() => setSelectedScreen('Profesores')} />
        <SidebarItem icon={<HiViewGrid size={22} />} text="Departamentos" active={selectedScreen === 'Departamentos'} onClick={() => setSelectedScreen('Departamentos')} />
        <SidebarItem icon={<HiClipboardList size={22} />} text="Evaluaciones" active={selectedScreen === 'Evaluaciones'} onClick={() => setSelectedScreen('Evaluaciones')} />
        <SidebarItem icon={<HiDocumentText size={22} />} text="Histórico" active={selectedScreen === 'Histórico'} onClick={() => setSelectedScreen('Histórico')} />
        <SidebarItem icon={<HiPlusCircle size={22} />} text="Nuevo Grupo" active={selectedScreen === 'Nuevo Grupo'} onClick={() => setSelectedScreen('Nuevo Grupo')} />
        <SidebarItem icon={<HiChartBar size={22} />} text="Resultados" active={selectedScreen === 'Resultados'} onClick={() => setSelectedScreen('Resultados')} />
        <SidebarItem icon={<HiOutlineTemplate size={22} />} text="Nueva Encuesta" active={selectedScreen === 'Nueva Encuesta'} onClick={() => setSelectedScreen('Nueva Encuesta')} />
      </Sidebar>

      <main className="flex-1 p-6">
        {mainContent}
      </main>
    </div>
  );
}

export default App;

