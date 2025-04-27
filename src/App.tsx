// src/App.tsx
import { useState } from 'react';
import Sidebar, { SidebarItem } from "./components/Sidebar";
import Login from "./components/Login";
import { 
  LayoutDashboard, Home, StickyNote, Layers, Flag, Calendar, LifeBuoy, Settings } from "lucide-react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    // Here you would typically validate credentials with your backend
    // For now, we'll just set isAuthenticated to true
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex">
      <Sidebar>
        {/* Sidebar Items */}
        <SidebarItem icon={<Home size={20} />} text="Home" alert />
        <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active />
        <SidebarItem icon={<Layers size={20} />} text="Projects" alert />
        <SidebarItem icon={<Calendar size={20} />} text="Calendar" />
        <SidebarItem icon={<StickyNote size={20} />} text="Tasks" />
        <SidebarItem icon={<Flag size={20} />} text="Reporting" />
        
        {/* Separador visual si quieres (opcional) */}
        <hr className="my-4 border-gray-200" />
        
        {/* Secondary Items */}
        <SidebarItem icon={<Settings size={20} />} text="Settings" />
        <SidebarItem icon={<LifeBuoy size={20} />} text="Help" />
      </Sidebar>

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Contenido principal aquí</h1>
      </main>
    </div>
  );
}

export default App;

