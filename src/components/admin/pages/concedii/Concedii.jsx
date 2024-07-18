import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./Concedii.scss";
import { getAllConcedii, getAngajatiDetails } from "../../../../Service/concedii";
import axios from 'axios';

const Concedii = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchConcedii();
  }, []);

  const fetchConcedii = async () => {
    try {
      const [concedii, angajati] = await Promise.all([
        getAllConcedii(),
        getAngajatiDetails()
      ]);

      const requestsWithDetails = concedii.map((concediu) => {
        const angajat = angajati.find((a) => a.angajatId === concediu.angajatId);  
        return {
          ...concediu,
          nume: angajat?.nume || "Lipsă",
          prenume: angajat?.prenume || "Lipsă",
          functie: angajat?.functie || "Lipsă",
        };
      });

      setRequests(requestsWithDetails);
    } catch (error) {
      console.error("Eroare la preluarea concediilor:", error);
    }
  };

  const handleUpdateStatus = async (request, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5050/api/concedii/${request.concediuId}`, {
        ...request,
        status: newStatus
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setRequests((prevRequests) =>
          prevRequests.map((r) =>
            r.concediuId === request.concediuId ? { ...r, status: newStatus } : r
          )
        );
      }
    } catch (error) {
      console.error('Eroare la actualizarea stării:', error);
    }
  };

  return (
    <div className="container-admin">
      <h1 className="titlu-admin">Solicitări concediu angajați</h1>
      <table className="tabel-admin">
        <thead>
          <tr>
            <th>Nume</th>
            <th>Prenume</th>
            <th>Funcția</th>
            <th>Data solicitării</th>
            <th>Data începerii</th>
            <th>Data încheierii</th>
            <th>Tip concediu</th>
            <th>Motiv</th>
            <th>Status</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.concediuId}>
              <td>{request.nume}</td>
              <td>{request.prenume}</td>
              <td>{request.functie}</td>
              <td>{new Date(request.dataSolicitare).toLocaleDateString()}</td>
              <td>{new Date(request.dataInceput).toLocaleDateString()}</td>
              <td>{new Date(request.dataSfarsit).toLocaleDateString()}</td>
              <td>{request.tipConcediu}</td>
              <td>{request.motiv}</td>
              <td>{request.status}</td>
              <td>
                <FontAwesomeIcon
                  icon={faCheck}
                  className="icon-accepta"
                  title="Acceptă"
                  onClick={() => handleUpdateStatus(request, 'Aprobat')}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className="icon-respinge"
                  title="Respinge"
                  onClick={() => handleUpdateStatus(request, 'Respins')}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Concedii;
