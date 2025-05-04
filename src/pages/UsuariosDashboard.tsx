import React, { useState, useRef, useEffect } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";

const emptyUser = {
  nombre: '',
  segundoNombre: '',
  apellido: '',
  segundoApellido: '',
  matricula: '',
  correo: '',
  contrasena: '',
  rol: 'Profesor',
};

const UsuariosDashboard: React.FC = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(emptyUser);
  const [showMenuId, setShowMenuId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>("todos");
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/usuarios', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    fetchUsuarios();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenuId(null);
      }
    }
    if (showMenuId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenuId]);

  const openAddModal = () => {
    setSelectedUser({...emptyUser});
    setModalType('add');
    setShowModal(true);
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setModalType('edit');
    setShowModal(true);
    setShowMenuId(null);
  };

  const openDeleteModal = (user: any) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
    setShowMenuId(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(emptyUser);
    setModalType(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedUser(emptyUser);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser.correo.toLowerCase().endsWith('@tec.mx')) {
      alert('El correo institucional debe terminar en @tec.mx');
      return;
    }
    if (!selectedUser.rol || selectedUser.rol === '') {
      alert('Por favor selecciona un rol de usuario.');
      return;
    }    
    const token = localStorage.getItem('token');

    if (modalType === 'add') {
      try {
        const response = await fetch('http://localhost:3000/api/usuarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            matricula: selectedUser.matricula,
            nombre: selectedUser.nombre,
            segundo_nombre: selectedUser.segundoNombre,
            apellido: selectedUser.apellido,
            segundo_apellido: selectedUser.segundoApellido,
            correo: selectedUser.correo,
            password: selectedUser.contrasena,
            rol: selectedUser.rol ? selectedUser.rol.charAt(0).toUpperCase() + selectedUser.rol.slice(1) : '',
          }),
        });

        const text = await response.text();
console.log('Respuesta cruda del servidor:', text);

let data;
try {
  data = JSON.parse(text);
} catch (e) {
  alert('El servidor devolvió una respuesta no válida');
  return;
}

        if (response.ok) {
          alert('Usuario creado correctamente');
          setUsuarios([...usuarios, selectedUser]);
          closeModal();
        } else {
          alert(data.error || 'Error al crear usuario');
        }
      } catch (error) {
        console.error(error);
        alert('Error de conexión con el servidor');
      }
    }

    if (modalType === 'edit') {
      try {
        const response = await fetch(`http://localhost:3000/api/usuarios/${selectedUser.matricula}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre: selectedUser.nombre,
            segundo_nombre: selectedUser.segundoNombre,
            apellido: selectedUser.apellido,
            segundo_apellido: selectedUser.segundoApellido,
            correo: selectedUser.correo,
            rol: selectedUser.rol ? selectedUser.rol.charAt(0).toUpperCase() + selectedUser.rol.slice(1) : 'Profesor',
          }),
        });

        const data = await response.json();
        if (response.ok) {
          alert('Usuario actualizado correctamente');
          setUsuarios(usuarios.map(u => u.matricula === selectedUser.matricula ? selectedUser : u));
          closeModal();
        } else {
          alert(data.error || 'Error al actualizar usuario');
        }
      } catch (error) {
        console.error(error);
        alert('Error de conexión con el servidor');
      }
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/usuarios/${selectedUser.matricula}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        alert('Usuario eliminado');
        setUsuarios(usuarios.filter(u => u.matricula !== selectedUser.matricula));
        closeDeleteModal();
      } else {
        alert(data.error || 'Error al eliminar usuario');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión con el servidor');
    }
  };
  

  const filteredUsuarios = roleFilter.toLowerCase() === "todos"
  ? usuarios
  : usuarios.filter(usuario => usuario.rol.toLowerCase() === roleFilter.toLowerCase());


  return (
    <div className="p-6 h-full bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Usuarios</h2>
        <button
          className="bg-white/50 backdrop-blur-sm text-gray-700 font-bold px-4 py-2 rounded-lg hover:bg-white/70 transition duration-150 ease-in-out border border-white/30"
          onClick={openAddModal}
        >
          Agregar usuario
        </button>
      </div>
      <div className="overflow-x-visible">
        <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-white/40 backdrop-blur-sm border-b border-white/30">Usuario</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-white/40 backdrop-blur-sm border-b border-white/30">
                  <div className="flex items-center">
                    <span>Rol</span>
                    <select
                      className="ml-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500/50 transition duration-150" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                      <option value="todos">Todos</option>
                      <option value="Administrador">Administrador</option>
                      <option value="Directivo">Directivo</option>
                      <option value="Talento">Talento</option>
                      <option value="Coordinador">Coordinador</option> 
                      <option value="Profesor">Profesor</option>
                    </select>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-white/40 backdrop-blur-sm border-b border-white/30"></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.map((usuario) => (
                <tr key={usuario.matricula} className="hover:bg-white/20 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    {usuario.nombre} {usuario.segundo_nombre ||''} {usuario.apellido} {usuario.segundo_apellido ||''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{usuario.rol}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    <button
                      className="p-2 rounded hover:bg-white/30 transition-colors duration-200"
                      onClick={() => setShowMenuId(usuario.matricula === showMenuId ? null : usuario.matricula)}
                    >
                      <HiOutlineDotsVertical size={20} />
                    </button>
                    {showMenuId === usuario.matricula && (
                      <div ref={menuRef} className="absolute right-0 mt-2 bg-white/30 backdrop-blur-lg rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 z-50 w-32">
                        <div className="flex flex-col">
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-white/20 text-sm text-gray-700 border-b border-white/30 transition-colors duration-200"
                            onClick={() => openEditModal(usuario)}
                          >
                            Editar
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-red-50/50 text-sm text-red-600 transition-colors duration-200"
                            onClick={() => openDeleteModal(usuario)}
                          >
                            Borrar
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para agregar/editar usuario */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 p-8 w-full max-w-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl transition-colors duration-200"
              onClick={closeModal}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4 text-gray-800">{modalType === 'add' ? 'Agregar usuario' : 'Editar usuario'}</h3>
            <form className="space-y-4" onSubmit={handleFormSubmit} autoComplete="off">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input type="text" className="mt-1 block w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded px-3 py-2 focus:outline-none focus:border-blue-500/50 transition duration-150" value={selectedUser.nombre} onChange={e => setSelectedUser({ ...selectedUser, nombre: e.target.value })} required />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Segundo nombre</label>
                  <input type="text" className="mt-1 block w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded px-3 py-2 focus:outline-none focus:border-blue-500/50 transition duration-150" value={selectedUser.segundoNombre} onChange={e => setSelectedUser({ ...selectedUser, segundoNombre: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Apellido</label>
                  <input type="text" className="mt-1 block w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded px-3 py-2 focus:outline-none focus:border-blue-500/50 transition duration-150" value={selectedUser.apellido} onChange={e => setSelectedUser({ ...selectedUser, apellido: e.target.value })} required />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Segundo apellido</label>
                  <input type="text" className="mt-1 block w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded px-3 py-2 focus:outline-none focus:border-blue-500/50 transition duration-150" value={selectedUser.segundoApellido} onChange={e => setSelectedUser({ ...selectedUser, segundoApellido: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Matrícula</label>
                  <input type="text" className="mt-1 block w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded px-3 py-2 focus:outline-none focus:border-blue-500/50 transition duration-150" value={selectedUser.matricula} onChange={e => setSelectedUser({ ...selectedUser, matricula: e.target.value })} required />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Correo institucional</label>
                  <input type="email" className="mt-1 block w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded px-3 py-2 focus:outline-none focus:border-blue-500/50 transition duration-150" value={selectedUser.correo} onChange={e => setSelectedUser({ ...selectedUser, correo: e.target.value })} required />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                  <input type="password" className="mt-1 block w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded px-3 py-2 focus:outline-none focus:border-blue-500/50 transition duration-150" value={selectedUser.contrasena}autoComplete="new password"onChange={e => setSelectedUser({ ...selectedUser, contrasena: e.target.value })} required={modalType === 'add'} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Rol de usuario</label>
                  <select className="mt-1 block w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded px-3 py-2 focus:outline-none focus:border-blue-500/50 transition duration-150" value={selectedUser.rol} onChange={e => setSelectedUser({ ...selectedUser, rol: e.target.value })} required>
                      <option value=""disabled>Selecciona un rol</option>
                      <option value="Administrador">Administrador</option>
                      <option value="Directivo">Directivo</option>
                      <option value="Talento">Talento</option>
                      <option value="Coordinador">Coordinador</option> 
                      <option value="Profesor">Profesor</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-white/50 backdrop-blur-sm text-gray-700 font-bold px-4 py-2 rounded-lg hover:bg-white/70 transition duration-150 ease-in-out border border-white/30">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación para borrar usuario */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 p-8 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl transition-colors duration-200"
              onClick={closeDeleteModal}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4 text-red-600">¿Estás seguro que deseas borrar este usuario?</h3>
            <p className="mb-6 text-gray-700">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded bg-white/50 backdrop-blur-sm text-gray-700 font-bold hover:bg-white/70 transition duration-150 ease-in-out border border-white/30" onClick={closeDeleteModal}>Cancelar</button>
              <button className="px-4 py-2 rounded bg-red-50/50 backdrop-blur-sm text-red-600 font-bold hover:bg-red-50/70 transition duration-150 ease-in-out border border-red-200/30" onClick={handleDelete}>Borrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosDashboard; 