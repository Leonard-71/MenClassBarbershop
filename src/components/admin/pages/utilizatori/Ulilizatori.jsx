import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Utilizatori.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Modal from './modalUtilizatori/ModalUtilizatori';
import EditareUtilizator from './editareUtilizator/EditareUtilizator';
import ConfirmDialog from '../confirmDialog/ConfirmDialog'; 
import lipsaImagine from '../../../../assets/navbar/profile.png';

const API_URL = 'http://localhost:5050/admin';

const Utilizatori = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Eroare la preluarea utilizatorilor:', error);
      }
    };

    fetchUsers();
  }, [token]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsConfirmDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/users/${userToDelete.email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user.email !== userToDelete.email));
      setIsConfirmDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSave = async (user) => {
    try {
      const { utilizator_id, ...userData } = user;
      if (editingUser) {
        await axios.put(`${API_URL}/users/${editingUser.email}`, userData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(users.map((u) => (u.email === editingUser.email ? { ...u, ...userData } : u)));
      } else {
        await axios.post(`${API_URL}/users`, userData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers([...users, user]);
      }
      setEditingUser(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.nume} ${user.prenume}`.toLowerCase();
    return (
      fullName.includes(filterText.toLowerCase()) &&
      (filterRole === '' || user.rol === filterRole)
    );
  });

  const handleTextFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const handleRoleFilterChange = (event) => {
    setFilterRole(event.target.value);
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'Administrator';
      case 'ROLE_ANGAJAT':
        return 'Angajat';
      case 'ROLE_CLIENT':
        return 'Client';
      default:
        return role;
    }
  };

  return (
    <div className="utilizatori">
      <h2>Utilizatori</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Filtrează după nume/prenume"
          value={filterText}
          onChange={handleTextFilterChange}
        />

        <select value={filterRole} onChange={handleRoleFilterChange}>
          <option value="">Toate rolurile</option>
          <option value="ROLE_ADMIN">Administrator</option>
          <option value="ROLE_ANGAJAT">Angajat</option>
          <option value="ROLE_CLIENT">Client</option>
        </select>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>Nume</th>
            <th>Prenume</th>
            <th>Telefon</th>
            <th>Email</th>
            <th>Imagine</th>
            <th>Rol</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={index}>
              <td>{user.nume}</td>
              <td>{user.prenume}</td>
              <td>{user.telefon}</td>
              <td>{user.email}</td>
              <td>
                <img 
                  src={user.poza ? `data:image/jpeg;base64,${user.poza}` : lipsaImagine} 
                  alt="User" 
                  className="client-image" 
                />
              </td>
              <td>{getRoleText(user.rol)}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(user)}>
                  <FontAwesomeIcon icon={faEdit} /> Editează
                </button>
                <button className="delete-button" onClick={() => handleDeleteClick(user)}>
                  <FontAwesomeIcon icon={faTrashAlt} /> Șterge
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <EditareUtilizator
            user={editingUser || { nume: '', prenume: '', telefon: '', email: '', poza: '', rol: '' }}
            onSave={handleSave}
          />
        </Modal>
      )}
      {isConfirmDialogOpen && (
        <ConfirmDialog
          message="Ești sigur că vrei să ștergi acest utilizator?"
          onConfirm={handleDelete}
          onCancel={() => setIsConfirmDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default Utilizatori;
