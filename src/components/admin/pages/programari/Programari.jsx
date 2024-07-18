import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import ro from "date-fns/locale/ro";
import "react-datepicker/dist/react-datepicker.css";
import "./Programari.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import EditProgramare from './editProgramare/EditProgramare';
import AdaugaProgramare from './adaugaProgramare/AdaugaProgramare';
import ModalProgramari from './modalProgramari/ModalProgramari';
import ConfirmDialog from '../confirmDialog/ConfirmDialog';  
import { fetchAppointments, fetchServices, fetchEmployees, fetchClient, deleteAppointment } from '../../../../Service/programari';

registerLocale("ro", ro);

const Programari = ({ token }) => { 
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState({});
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); 
  const [appointmentToDelete, setAppointmentToDelete] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentsData = await fetchAppointments(token);

        const clientIds = appointmentsData
          .filter(appointment => appointment.clientId !== 0)
          .map(appointment => appointment.clientId);

        const uniqueClientIds = [...new Set(clientIds)];
        const clientPromises = uniqueClientIds.map(id => fetchClient(id, token));

        const clientResponses = await Promise.all(clientPromises);
        const clientsData = clientResponses.reduce((acc, client) => {
          acc[client.utilizatorId] = client;
          return acc;
        }, {});
        setAppointments(appointmentsData);
        setClients(clientsData);
      } catch (error) {
        console.error("Eroare la preluarea programărilor sau a clienților:", error);
      }
    };

    const fetchServiceData = async () => {
      try {
        const servicesData = await fetchServices(token);
        setServices(servicesData.reduce((acc, service) => {
          acc[service.serviciuId] = service.denumire;
          return acc;
        }, {}));
      } catch (error) {
        console.error("Eroare la preluarea serviciilor:", error);
      }
    };

    const fetchEmployeeData = async () => {
      try {
        const employeesData = await fetchEmployees(token);
        setEmployees(employeesData);
      } catch (error) {
        console.error("Eroare la preluarea angajaților:", error);
      }
    };

    fetchData();
    fetchServiceData();
    fetchEmployeeData();
  }, [token]);

  const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('ro-RO', options);
  };

  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(':');
    return `${hour}:${minute}`;
  };

  const handleEdit = async (appointment) => {
    if (appointment.clientId !== 0 || appointment.clientId !== null ) {
      try {
        const clientData = await fetchClient(appointment.clientId, token);
        appointment = { ...appointment, ...clientData };
      } catch (error) {
        console.error("Eroare la preluarea datelor clientului:", error);
      }
    }
    const selectedEmployee = employees.find(emp => emp.angajatId === appointment.angajatId);
    const selectedService = services[appointment.serviciuId];
    setEditingAppointment({
      ...appointment,
      angajat: selectedEmployee ? `${selectedEmployee.nume} ${selectedEmployee.prenume}` : '',
      serviciu: selectedService || '',
      ora: appointment.oraProgramare ? appointment.oraProgramare.slice(0, 5) : ''
    });
    setIsAdding(false);
  };

  const handleDelete = async () => {
    if (appointmentToDelete) {
      try {
        await deleteAppointment(appointmentToDelete, token);
        setAppointments(appointments.filter(appointment => appointment.programareId !== appointmentToDelete));
        setAppointmentToDelete(null);
        setShowConfirmDialog(false);
      } catch (error) {
        console.error("Eroare la ștergerea programării:", error);
      }
    }
  };

  const handleDeleteClick = (id) => {
    setAppointmentToDelete(id);
    setShowConfirmDialog(true);
  };

  const handleSave = (updatedAppointment) => {
    if (updatedAppointment.clientId === 0) {
      updatedAppointment.clientId = null;  
    }
    if (updatedAppointment.programareId) {
      setAppointments(appointments.map(app => app.programareId === updatedAppointment.programareId ? updatedAppointment : app));
    } else {
      setAppointments([...appointments, updatedAppointment]);
    }
    setEditingAppointment(null);
    setIsAdding(false);
  };

  const filteredAppointments = appointments.filter(appointment => {
    return (
      (selectedDate === null || isSameDay(appointment.dataProgramare, selectedDate)) &&
      (selectedEmployee === "" || appointment.angajatId === parseInt(selectedEmployee)) &&
      (selectedService === "" || appointment.serviciuId === parseInt(selectedService))
    );
  });
  

  return (
    <div className="programari-admin">
      <h2>Programări</h2>
      <div className="filter-container-programari-admin">
        <div className="filter-group-programari-admin">
          <div className="aliniere-data">
            <label>Data curentă</label>
            <DatePicker
  selected={selectedDate}
  onChange={(date) => setSelectedDate(date)}
  dateFormat="dd/MM/yyyy"
  locale="ro"
  className="date-picker-programari-admin"
  placeholderText="Selectează data"

/>
          </div>
        </div>
        <div className="filter-group-programari-admin">
          <label>Selectează un angajat</label>
          <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
            <option value="">Toți angajații</option>
            {employees.map((employee) => (
              <option key={employee.angajatId} value={employee.angajatId}>
                {employee.nume} {employee.prenume}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group-programari-admin">
          <label>Selectează un serviciu</label>
          <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
            <option value="">Toate serviciile</option>
            {Object.entries(services).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group-programari-admin">
          <button className="add-button-programari-admin" onClick={() => { setEditingAppointment({}); setIsAdding(true); }}>
            <FontAwesomeIcon icon={faPlus} /> Adaugă Programare
          </button>
        </div>
        
      </div>
      <table className="appointments-table-programari-admin">
        <thead>
          <tr>
            <th>Nume</th>
            <th>Prenume</th>
            <th>Telefon</th>
            <th>Serviciu</th>
            <th>Angajat</th>
            <th>Data</th>
            <th>Ora</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((appointment) => {
            const client = appointment.clientId === 0 ? appointment : clients[appointment.clientId] || {};
            return (
              <tr key={appointment.programareId}>
                <td>{client.nume || appointment.nume}</td>
                <td>{client.prenume || appointment.prenume}</td>
                <td>{client.telefon || appointment.telefon}</td>
                <td>{services[appointment.serviciuId] || "N/A"}</td>
                <td>{employees.find(emp => emp.angajatId === appointment.angajatId)?.nume || "N/A"} {employees.find(emp => emp.angajatId === appointment.angajatId)?.prenume || ""}</td>
                <td>{formatDate(appointment.dataProgramare)}</td>
                <td>{formatTime(appointment.oraProgramare)}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEdit(appointment)}>
                    <FontAwesomeIcon icon={faEdit} /> Editează
                  </button>
                  <button className="delete-button" onClick={() => handleDeleteClick(appointment.programareId)}>
                    <FontAwesomeIcon icon={faTrashAlt} /> Șterge
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {editingAppointment && (
        <ModalProgramari onClose={() => { setEditingAppointment(null); setIsAdding(false); }}>
          {isAdding ? (
            <AdaugaProgramare
              appointment={editingAppointment}
              onSave={handleSave}
              onClose={() => { setEditingAppointment(null); setIsAdding(false); }}
              isAdding={true}
            />
          ) : (
            <EditProgramare
              appointment={editingAppointment}
              onSave={handleSave}
              onClose={() => { setEditingAppointment(null); setIsAdding(false); }}
              isAdding={false}
            />
          )}
        </ModalProgramari>
      )}
      {showConfirmDialog && (
        <ConfirmDialog
          message="Ești sigur că vrei să ștergi acestă programare?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </div>
  );
};

export default Programari;
