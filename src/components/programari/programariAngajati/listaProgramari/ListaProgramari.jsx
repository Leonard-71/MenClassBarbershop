import React, { useState, useEffect } from "react";
import "./ListaProgramari.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faSearch, faSave, faPlus } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import ro from "date-fns/locale/ro";
import ConfirmDialog from "../../../admin/pages/confirmDialog/ConfirmDialog"; 

registerLocale('ro', ro);

const SmallDatePicker = ({ selected, onChange }) => {
  return (
    <div className="small-date-picker">
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        locale="ro"
        className="small-react-datepicker__input-container"
      />
    </div>
  );
};

const CustomDatePicker = ({ selected, onChange }) => {
  return (
    <div className="date-picker">
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        locale="ro"
        className="react-datepicker__input-container"
      />
    </div>
  );
};

const ListaProgramari = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form, setForm] = useState({
    nume: "",
    prenume: "",
    telefon: "",
    serviciu: "",
    data: new Date(),
    ora: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState(new Date());
  const [message, setMessage] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [currentAppointmentId, setCurrentAppointmentId] = useState(null);
  const [angajatId, setAngajatId] = useState(null);
  const [currentClientId, setCurrentClientId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);  
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);  

  const textListaProgramari = {
    titlu1: "ULTIMELE PROGRAMĂRI",
    nume: "NUME",
    prenume: "PRENUME",
    telefon: "TELEFON",
    serviciu: "SERVICIU",
    data: "DATA",
    ora: "ORA",
    actiuni: "ACȚIUNI",
    editeaza: "Editează",
    sterge: "Șterge",
    cauta: "CAUTĂ",
    salveazaModificarile: "SALVEAZĂ MODIFICĂRILE",
    adaugaProgramare: "ADAUGĂ",
    eroareToken: "Token invalid sau expirat. Vă rugăm să vă autentificați din nou.",
    eroareGeneral: "A apărut o eroare. Vă rugăm să încercați din nou.",
  };

  useEffect(() => {
    const fetchUserData = async (email) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5050/admin/users/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();

        if (response.ok) {
          const utilizatorId = result.utilizatorId;
          const angajatiResponse = await fetch('http://localhost:5050/api/angajati', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const angajatiResult = await angajatiResponse.json();

          if (angajatiResponse.ok) {
            const angajat = angajatiResult.find(a => a.utilizatorId === utilizatorId);
            if (angajat) {
              setAngajatId(angajat.angajatId);
              fetchAppointments();  
            } else {
              console.error('Angajat cu utilizatorId specific nu a fost găsit.');
            }
          } else {
            console.error('Eroare la preluarea angajaților:', angajatiResult.message);
          }
        } else {
          console.error('Eroare la preluarea utilizatorId:', result.message);
        }
      } catch (error) {
        console.error("Eroare la preluarea utilizatorId:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5050/api/servicii', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (response.ok) {
          setServices(result);
        } else {
          console.error('Eroare la preluarea serviciilor:', result.message);
        }
      } catch (error) {
        console.error("Eroare la preluarea serviciilor:", error);
      }
    };

    const email = localStorage.getItem('email');
    if (email) {
      fetchUserData(email);
      fetchServices();
    }
  }, []);

  const getCurrentDate = () => {
    return new Date();
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5050/api/programari', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (response.ok) {
        const appointmentsWithDetails = await Promise.all(result.map(async (appointment) => {
          const client = appointment.clientId ? await fetchClientDetails(appointment.clientId) : null;
          const serviciu = await fetchServiceDetails(appointment.serviciuId);
          if (client && serviciu) {
            return {
              ...appointment,
              clientNume: client.nume,
              clientPrenume: client.prenume,
              clientTelefon: client.telefon,
              serviciuDenumire: serviciu.denumire,
              serviciuDescriere: serviciu.descriereServiciu,
            };
          } else if (serviciu) {
            return {
              ...appointment,
              clientNume: appointment.nume,
              clientPrenume: appointment.prenume,
              clientTelefon: appointment.telefon,
              serviciuDenumire: serviciu.denumire,
              serviciuDescriere: serviciu.descriereServiciu,
            };
          } else {
            return appointment;
          }
        }));

        setAppointments(appointmentsWithDetails);
        setFilteredAppointments(appointmentsWithDetails.filter(appointment => {
          const appointmentDate = new Date(appointment.dataProgramare);
          return appointmentDate.toLocaleDateString("ro-RO") === searchDate.toLocaleDateString("ro-RO");
        }));
      } else {
        console.error('Eroare la preluarea programărilor:', result.message);
      }
    } catch (error) {
      console.error("Eroare la preluarea programărilor:", error);
    }
  };

  const fetchClientDetails = async (clientId) => {
    const clientResponse = await fetch(`http://localhost:5050/admin/users/id/${clientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const clientResult = await clientResponse.json();
    if (clientResponse.ok) {
      return clientResult;
    } else {
      console.error('Eroare la preluarea detaliilor clientului:', clientResult.message);
      return null;
    }
  };

  const fetchServiceDetails = async (serviciuId) => {
    const serviceResponse = await fetch(`http://localhost:5050/api/servicii/${serviciuId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const serviceResult = await serviceResponse.json();
    if (serviceResponse.ok) {
      return serviceResult;
    } else {
      console.error('Eroare la preluarea detaliilor serviciului:', serviceResult.message);
      return null;
    }
  };

  const handleSearch = () => {
    const filtered = appointments.filter(appointment => {
      const searchDateMatch = searchDate ? new Date(appointment.dataProgramare).toLocaleDateString("ro-RO") === searchDate.toLocaleDateString("ro-RO") : true;
      const searchTermMatch = (appointment.clientNume?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              appointment.clientPrenume?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              appointment.serviciuDenumire?.toLowerCase().includes(searchTerm.toLowerCase()));
      return searchDateMatch && searchTermMatch;
    });
    setFilteredAppointments(filtered);
  };

  const handleSearchDateChange = (date) => {
    setSearchDate(date);
    const filtered = appointments.filter(appointment => {
      const searchDateMatch = date ? new Date(appointment.dataProgramare).toLocaleDateString("ro-RO") === date.toLocaleDateString("ro-RO") : true;
      const searchTermMatch = (appointment.clientNume?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              appointment.clientPrenume?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              appointment.serviciuDenumire?.toLowerCase().includes(searchTerm.toLowerCase()));
      return searchDateMatch && searchTermMatch;
    });
    setFilteredAppointments(filtered);
  };

  const handleEdit = (index) => {
    const appointment = filteredAppointments[index];
    setForm({
      nume: appointment.clientNume || appointment.nume,
      prenume: appointment.clientPrenume || appointment.prenume,
      telefon: appointment.clientTelefon || appointment.telefon,
      serviciu: appointment.serviciuDenumire,
      data: new Date(appointment.dataProgramare),
      ora: appointment.oraProgramare,
    });
    setCurrentAppointmentId(appointment.programareId);
    setCurrentClientId(appointment.clientId); 
    setIsEditMode(true);
    setIsFormVisible(true);
  };

  const handleDelete = (index) => {
    setAppointmentToDelete(index);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (appointmentToDelete === null) return;

    const appointmentId = filteredAppointments[appointmentToDelete].programareId;
    try {
      const response = await fetch(`http://localhost:5050/api/programari/${appointmentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setFilteredAppointments((prev) => prev.filter((_, i) => i !== appointmentToDelete));
        setShowConfirmDialog(false);
        setAppointmentToDelete(null);
      } else {
        console.error("Eroare la ștergerea programării");
      }
    } catch (error) {
      console.error("Eroare la ștergerea programării:", error);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setAppointmentToDelete(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setForm((prevForm) => ({
      ...prevForm,
      data: date,
    }));
  };

  const isTimeSlotAvailable = (data, ora, durata) => {
    const newStartTime = new Date(data);
    const [hours, minutes] = ora.split(":").map(Number);
    newStartTime.setHours(hours, minutes);

    const newEndTime = new Date(newStartTime);
    newEndTime.setMinutes(newEndTime.getMinutes() + durata);

    for (const appointment of appointments) {
      const appointmentDate = new Date(appointment.dataProgramare);
      if (appointmentDate.toLocaleDateString() === data.toLocaleDateString()) {
        const [appHours, appMinutes] = appointment.oraProgramare.split(":").map(Number);
        const appStartTime = new Date(appointmentDate);
        appStartTime.setHours(appHours, appMinutes);

        const appEndTime = new Date(appStartTime);
        const service = services.find(service => service.denumire === appointment.serviciuDenumire);
        if (service) {
          appEndTime.setMinutes(appEndTime.getMinutes() + service.durata + 10); 
        }

        if (
          (newStartTime >= appStartTime && newStartTime < appEndTime) ||
          (newEndTime > appStartTime && newEndTime <= appEndTime)
        ) {
          return false;
        }
      }
    }
    return true;
  };

  const handleUpdateAppointment = async () => {
    const method = "PUT";
    const endpoint = `http://localhost:5050/api/programari/${currentAppointmentId}`;

    const formatDate = (date) => {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    };

    const serviciu = services.find(service => service.denumire === form.serviciu);
    const durata = serviciu ? serviciu.durata : 0;

    if (!isTimeSlotAvailable(form.data, form.ora, durata)) {
      setMessage("Intervalul orar selectat nu este disponibil.");
      return;
    }

    const payload = {
      clientId: currentClientId,
      angajatId: angajatId,
      serviciuId: serviciu.serviciuId,
      dataProgramare: formatDate(form.data),
      oraProgramare: form.ora,
      nume: currentClientId === null ? form.nume : null,
      prenume: currentClientId === null ? form.prenume : null,
      telefon: currentClientId === null ? form.telefon : null,
    };

    try {
      const token = localStorage.getItem('token');  

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`  
        },
        body: JSON.stringify(payload),
      });

      let responseData;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (response.ok) {
        setMessage(responseData);
        fetchAppointments();  
        setIsFormVisible(false);
      } else {
        console.error("Eroare la salvarea programării");
        setMessage(responseData);
      }
    } catch (error) {
      console.error("Eroare la salvarea programării:", error);
      setMessage("Eroare la salvarea programării");
    }
  };

  const handleAddAppointment = () => {
    setForm({
      nume: "",
      prenume: "",
      telefon: "",
      serviciu: "",
      data: new Date(),
      ora: "",
    });
    setCurrentAppointmentId(null);
    setCurrentClientId(null);
    setIsEditMode(false);
    setIsFormVisible(true);
  };

  const handleSaveNewAppointment = async () => {
    const method = "POST";
    const endpoint = "http://localhost:5050/api/programari";

    const formatDate = (date) => {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    };

    const serviciu = services.find(service => service.denumire === form.serviciu);
    const durata = serviciu ? serviciu.durata : 0;

    if (!isTimeSlotAvailable(form.data, form.ora, durata)) {
      setMessage("Intervalul orar selectat nu este disponibil.");
      return;
    }

    const payload = {
      clientId: null,
      angajatId: angajatId,
      serviciuId: serviciu.serviciuId,
      dataProgramare: formatDate(form.data),
      oraProgramare: form.ora,
      nume: form.nume,
      prenume: form.prenume,
      telefon: form.telefon,
    };
    try {
      const token = localStorage.getItem('token');  

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`  
        },
        body: JSON.stringify(payload),
      });

      let responseData;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (response.ok) {
        setMessage(responseData);
        fetchAppointments();  
        setIsFormVisible(false);
      } else {
        console.error("Eroare la salvarea programării");
        setMessage(responseData);
      }
    } catch (error) {
      console.error("Eroare la salvarea programării:", error);
      setMessage("Eroare la salvarea programării");
    }
  };

  const formatDateDisplay = (date) => {
    return date.toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`1970-01-01T${timeString}Z`);
    const hours = String(time.getUTCHours()).padStart(2, "0");
    const minutes = String(time.getUTCMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="ultimele-programari">
      <div className="header">{textListaProgramari.titlu1}</div>
      <div className="search-bar small-search-bar">
        <input 
          type="text" 
          placeholder="Cauta..." 
          className="small-input" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <button className="search-button small-button" onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} /> {textListaProgramari.cauta}
        </button>
        <SmallDatePicker selected={searchDate} onChange={handleSearchDateChange} />
      </div>

      <table>
        <thead>
          <tr>
            <th>{textListaProgramari.nume}</th>
            <th>{textListaProgramari.prenume}</th>
            <th>{textListaProgramari.telefon}</th>
            <th>{textListaProgramari.serviciu}</th>
            <th>{textListaProgramari.data}</th>
            <th>{textListaProgramari.ora}</th>
            <th>{textListaProgramari.actiuni}</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((appointment, index) => (
            <tr key={appointment.programareId || index}>
              <td>{appointment.clientId !== null ? appointment.clientNume : appointment.nume || '[null]'}</td>
              <td>{appointment.clientId !== null ? appointment.clientPrenume : appointment.prenume || '[null]'}</td>
              <td>{appointment.clientId !== null ? appointment.clientTelefon : appointment.telefon || '[null]'}</td>
              <td>
                <div className="serviciu-title">{appointment.serviciuDenumire || '[null]'}</div>
                <div className="serviciu-description">
                  {appointment.serviciuDescriere || ' '}
                </div>
              </td>
              <td>{appointment.dataProgramare ? formatDateDisplay(new Date(appointment.dataProgramare)) : '[null]'}</td>
              <td>{appointment.oraProgramare ? formatTime(appointment.oraProgramare) : '[null]'}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(index)}>
                  <FontAwesomeIcon icon={faEdit} /> {textListaProgramari.editeaza}
                </button>
                <button className="delete-button" onClick={() => handleDelete(index)}>
                  <FontAwesomeIcon icon={faTrashAlt} /> {textListaProgramari.sterge}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {message && <div className="message">{message}</div>}
      <button className="add-button" onClick={handleAddAppointment}>
        <FontAwesomeIcon icon={faPlus} /> {textListaProgramari.adaugaProgramare}
      </button>
      {isFormVisible && (
        <div className="add-edit-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nume">{textListaProgramari.nume}</label>
              <input
                type="text"
                id="nume"
                name="nume"
                placeholder="Introduceți numele"
                value={form.nume}
                onChange={handleInputChange}
                disabled={isEditMode && currentClientId !== null}
              />
            </div>
            <div className="form-group">
              <label htmlFor="serviciu">{textListaProgramari.serviciu}</label>
              <select
                id="serviciu"
                name="serviciu"
                value={form.serviciu}
                onChange={handleInputChange}
              >
                <option value="">Serviciu dorit</option>
                {services.map(service => (
                  <option key={service.serviciuId} value={service.denumire}>
                    {service.denumire}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prenume">{textListaProgramari.prenume}</label>
              <input
                type="text"
                id="prenume"
                name="prenume"
                placeholder="Introduceți prenumele"
                value={form.prenume}
                onChange={handleInputChange}
                disabled={isEditMode && currentClientId !== null}
              />
            </div>
            <div className="form-group">
              <label htmlFor="data">{textListaProgramari.data}</label>
              <CustomDatePicker selected={form.data} onChange={handleDateChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telefon">{textListaProgramari.telefon}</label>
              <input
                type="text"
                id="telefon"
                name="telefon"
                placeholder="Introduceți numărul de telefon"
                value={form.telefon}
                onChange={handleInputChange}
                disabled={isEditMode && currentClientId !== null}
              />
            </div>
            <div className="form-group">
              <label htmlFor="ora">{textListaProgramari.ora}</label>
              <input
                type="time"
                id="ora"
                name="ora"
                value={form.ora}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <button className="add-button" onClick={isEditMode ? handleUpdateAppointment : handleSaveNewAppointment}>
            <FontAwesomeIcon icon={faSave} /> {textListaProgramari.salveazaModificarile}
          </button>
        </div>
      )}
      {showConfirmDialog && (
        <ConfirmDialog 
          message="Ești sigur că vrei să ștergi această programare?" 
          onConfirm={confirmDelete} 
          onCancel={cancelDelete} 
        />
      )}
    </div>
  );
};

export default ListaProgramari;
