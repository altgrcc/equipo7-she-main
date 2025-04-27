import React from "react";

const usuarios = [
  { id: 1, nombre: "Juan Pérez", rol: "Administrador" },
  { id: 2, nombre: "Ana Gómez", rol: "Profesor" },
  { id: 3, nombre: "Luis Martínez", rol: "Estudiante" },
];

const UsuariosDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Usuarios</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Usuario</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50"></th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{usuario.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{usuario.rol}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded transition">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsuariosDashboard; 