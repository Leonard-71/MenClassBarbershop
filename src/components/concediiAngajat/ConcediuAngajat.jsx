import React, { useState, useEffect, useCallback } from 'react';
import './ConcediuAngajat.scss';
import Modal from './modalConcediu/ModalConcediu';
import SolicitareConcediu from './solicitareConcediu/SolicitareConcediu';
import IntroPagini from '../introPagini/IntroPagini';
import logoConcedii from '../../assets/concedii/concedii.png';
import { getConcediiByAngajatId } from '../../Service/concedii';
import axios from 'axios';

const ConcediuAngajat = () => {
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [angajatId, setAngajatId] = useState(null);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedToken = localStorage.getItem('token');
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const fetchConcedii = useCallback(async () => {
    try {
      const userResponse = await axios.get(`http://localhost:5050/admin/users/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const utilizator = userResponse.data;

      if (utilizator.rol !== 'ROLE_ANGAJAT') {
        throw new Error('Utilizatorul nu este angajat');
      }

      const angajatResponse = await axios.get(`http://localhost:5050/api/angajati/email?email=${utilizator.email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const angajat = angajatResponse.data;
      setAngajatId(angajat.angajatId);

      let concediiResponse = await getConcediiByAngajatId(angajat.angajatId, token);
      concediiResponse = concediiResponse.sort((a, b) => new Date(b.dataInceput) - new Date(a.dataInceput));
      setRequests(concediiResponse);
    } catch (error) {
      console.error('Eroare la preluarea concediilor:', error);
    }
  }, [email, token]);

  useEffect(() => {
    if (email && token) {
      fetchConcedii();
    }
  }, [email, token, fetchConcedii]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const titluPagina = 'Concediile mele';

  return (
    <div className="container-angajat">
      <IntroPagini logoPagina={logoConcedii} titluPagina={titluPagina} />
      <button className="buton-solicita" onClick={handleOpenModal}>
        Solicită concediu
      </button>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <SolicitareConcediu angajatId={angajatId} onClose={handleCloseModal} token={token} onConcediuAdded={fetchConcedii} />
      </Modal>
      <table className="tabel-angajat">
        <thead>
          <tr>
            <th>Tip concediu</th>
            <th>Data început</th>
            <th>Data sfârșit</th>
            <th>Motiv</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.concediuId}>
              <td>{request.tipConcediu}</td>
              <td>{new Date(request.dataInceput).toLocaleDateString()}</td>
              <td>{new Date(request.dataSfarsit).toLocaleDateString()}</td>
              <td>{request.motiv}</td>
              <td>{request.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConcediuAngajat;
