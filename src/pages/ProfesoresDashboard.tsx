import React from "react";

const initialProfesores = [
  {
    id: '1',
    nombre: 'Juan',
    segundoNombre: 'Carlos',
    apellido: 'Pérez',
    segundoApellido: 'González',
    departamento: 'Académico',
    materias: ['Matemáticas I', 'Matemáticas II']
  },
  {
    id: '2',
    nombre: 'María',
    segundoNombre: 'Isabel',
    apellido: 'García',
    segundoApellido: 'López',
    departamento: 'Académico',
    materias: ['Física']
  },
  {
    id: '3',
    nombre: 'Carlos',
    segundoNombre: 'Alberto',
    apellido: 'López',
    segundoApellido: 'Martínez',
    departamento: 'Extraacadémico Deportivo',
    materias: ['Fútbol']
  },
  {
    id: '4',
    nombre: 'Ana',
    segundoNombre: 'María',
    apellido: 'Martínez',
    segundoApellido: 'Sánchez',
    departamento: 'Extraacadémico Deportivo',
    materias: ['Básquetbol']
  },
  {
    id: '5',
    nombre: 'Pedro',
    segundoNombre: 'José',
    apellido: 'Sánchez',
    segundoApellido: 'Ramírez',
    departamento: 'Extraacadémico Cultural',
    materias: ['Piano']
  },
  {
    id: '6',
    nombre: 'Laura',
    segundoNombre: 'Patricia',
    apellido: 'Ramírez',
    segundoApellido: 'Torres',
    departamento: 'Extraacadémico Cultural',
    materias: ['Teatro']
  },
  {
    id: '7',
    nombre: 'Roberto',
    segundoNombre: 'Antonio',
    apellido: 'Torres',
    segundoApellido: 'Mendoza',
    departamento: 'Laboratorista',
    materias: ['Química']
  },
  {
    id: '8',
    nombre: 'Sofía',
    segundoNombre: 'Alejandra',
    apellido: 'Mendoza',
    segundoApellido: 'Ruiz',
    departamento: 'Laboratorista',
    materias: ['Biología']
  },
  {
    id: '9',
    nombre: 'Miguel',
    segundoNombre: 'Ángel',
    apellido: 'Ruiz',
    segundoApellido: 'Hernández',
    departamento: 'Tutoreo',
    materias: ['Tutoreo III']
  },
  {
    id: '10',
    nombre: 'Elena',
    segundoNombre: 'Gabriela',
    apellido: 'Hernández',
    segundoApellido: 'Pérez',
    departamento: 'Tutoreo',
    materias: ['Tutoreo I']
  }
];

const ProfesoresDashboard: React.FC = () => {
  return (
    <div className="p-6 h-full bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Profesores</h2>
      </div>
      
      <div className="overflow-x-auto">
        <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-white/40 backdrop-blur-sm border-b border-white/30">Profesor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-white/40 backdrop-blur-sm border-b border-white/30">Departamento</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-white/40 backdrop-blur-sm border-b border-white/30">Materias</th>
              </tr>
            </thead>
            <tbody>
              {initialProfesores.map((profesor) => (
                <tr 
                  key={profesor.id} 
                  className="hover:bg-white/20 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
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
    </div>
  );
};

export default ProfesoresDashboard; 