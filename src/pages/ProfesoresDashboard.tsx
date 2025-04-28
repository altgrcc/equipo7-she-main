import React from "react";

const initialProfesores = [
  { 
    id: 1, 
    nombre: "Juan", 
    segundoNombre: "", 
    apellido: "Pérez", 
    segundoApellido: "", 
    matricula: "P001", 
    correo: "juan@uni.mx", 
    departamento: "Ciencias", 
    materias: ["Matemáticas", "Física"]
  },
  { 
    id: 2, 
    nombre: "Ana", 
    segundoNombre: "", 
    apellido: "Gómez", 
    segundoApellido: "", 
    matricula: "P002", 
    correo: "ana@uni.mx", 
    departamento: "Humanidades", 
    materias: ["Literatura", "Historia"]
  },
];

const ProfesoresDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Profesores</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Profesor</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Departamento</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Materias</th>
            </tr>
          </thead>
          <tbody>
            {initialProfesores.map((profesor) => (
              <tr key={profesor.id} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {profesor.nombre} {profesor.segundoNombre} {profesor.apellido} {profesor.segundoApellido}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{profesor.departamento}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {profesor.materias.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfesoresDashboard; 