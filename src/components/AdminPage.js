import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore'; 
import { firestore } from '../firebase';
import { useAuth } from '../context/AuthContext';
import './AdminPage.css';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(120);
  const [minFlats, setMinFlats] = useState(0);
  const [maxFlats, setMaxFlats] = useState(100);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(firestore, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
      setFilteredUsers(usersList); // Inicializa con todos los usuarios
    };

    fetchUsers();
  }, []);

  const applyFilters = () => {
    let filtered = users;

    if (selectedRole) {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    filtered = filtered.filter(user => user.age >= minAge && user.age <= maxAge);
    filtered = filtered.filter(user => (user.flatsCreated || 0) >= minFlats && (user.flatsCreated || 0) <= maxFlats);

    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(firestore, 'users', userId)); 
      setUsers(users.filter(user => user.id !== userId));
      setFilteredUsers(filteredUsers.filter(user => user.id !== userId)); // Actualiza los usuarios filtrados
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await updateDoc(doc(firestore, 'users', userId), { role: newRole });
      setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
      setFilteredUsers(filteredUsers.map(user => user.id === userId ? { ...user, role: newRole } : user)); // Actualiza los usuarios filtrados
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleRefresh = () => {
    setFilteredUsers(users);
    setSelectedRole('');
    setMinAge(0);
    setMaxAge(120);
    setMinFlats(0);
    setMaxFlats(100);
  };

  if (currentUser.role !== 'admin') {
    return <p>No tienes acceso a esta página.</p>;
  }

  return (
    <div className="admin-container">
      <h1>Admin Page</h1>
      <div className="filters">
        <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
          <option value="">Seleccione un rol</option>
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
          <option value="renter">Renter</option> {/* Opción para "renter" */}
        </select>
        <input
          type="number"
          value={minAge}
          onChange={(e) => setMinAge(Number(e.target.value))}
          placeholder="Edad mínima"
        />
        <input
          type="number"
          value={maxAge}
          onChange={(e) => setMaxAge(Number(e.target.value))}
          placeholder="Edad máxima"
        />
        <input
          type="number"
          value={minFlats}
          onChange={(e) => setMinFlats(Number(e.target.value))}
          placeholder="Mínimo de Flats"
        />
        <input
          type="number"
          value={maxFlats}
          onChange={(e) => setMaxFlats(Number(e.target.value))}
          placeholder="Máximo de Flats"
        />
        <button onClick={applyFilters}>Filtrar</button>
        <button onClick={handleRefresh}>Refrescar</button>
        <button onClick={() => navigate('/main')}>Volver a MainPage</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Flats Creados</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.flatsCreated || 0}</td>
              <td>
                <button onClick={() => alert('Ver perfil aún no implementado')}>Ver Perfil</button>
                <button onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
                <button onClick={() => handleChangeRole(user.id, user.role === 'admin' ? 'user' : user.role === 'user' ? 'renter' : 'admin')}>
                  Cambiar Rol
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;





