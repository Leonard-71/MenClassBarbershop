import React, { useState, useEffect, useMemo } from 'react';
import './EditProgramare.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import DatePicker, { registerLocale } from "react-datepicker";
import ro from "date-fns/locale/ro";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("ro", ro);

const EditProgramare = ({ appointment, onSave, onClose, isAdding }) => {
  const initialFormState = useMemo(() => ({
    nume: '',
    prenume: '',
    telefon: '',
    serviciu: '',
    angajat: '',
    data: new Date(),
    ora: '',
    programareId: null,
    clientId: null,
    ...appointment,
  }), [appointment]);

  const [formState, setFormState] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchServices();
  }, []);

  useEffect(() => {
    if (appointment) {
      setFormState({
        ...initialFormState,
        ...appointment,
        data: appointment.dataProgramare ? parseDate(appointment.dataProgramare) : new Date(),
        ora: appointment.oraProgramare ? appointment.oraProgramare.slice(0, 5) : '',
      });
    }
  }, [appointment, initialFormState]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/angajati');
      setEmployees(response.data);
    } catch (error) {
      console.error('Eroare la preluarea angajaților:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/servicii');
      setServices(response.data);
    } catch (error) {
      console.error('Eroare la preluarea serviciilor:', error);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formState.nume.match(/^[A-Za-z]+$/)) newErrors.nume = 'Numele trebuie să conțină doar litere.';
    if (!formState.prenume.match(/^[A-Za-z]+$/)) newErrors.prenume = 'Prenumele trebuie să conțină doar litere.';
    if (!formState.telefon.match(/^[0-9]+$/)) newErrors.telefon = 'Numărul de telefon trebuie să conțină doar cifre.';
    if (!formState.serviciu.match(/^[A-Za-z ]+$/)) newErrors.serviciu = 'Serviciul trebuie să conțină doar litere.';
    if (!formState.nume) newErrors.nume = 'Numele este obligatoriu.';
    if (!formState.prenume) newErrors.prenume = 'Prenumele este obligatoriu.';
    if (!formState.telefon) newErrors.telefon = 'Numărul de telefon este obligatoriu.';
    if (!formState.serviciu) newErrors.serviciu = 'Serviciul este obligatoriu.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormState({
      ...formState,
      data: date,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;
  
    setIsSubmitting(true);
  
    const selectedEmployee = employees.find(emp => `${emp.nume} ${emp.prenume}` === formState.angajat);
    const selectedService = services.find(service => service.denumire === formState.serviciu);
  
    const payload = {
      programareId: formState.programareId,
      clientId: formState.clientId !== 0 ? formState.clientId : null,  
      angajatId: selectedEmployee ? selectedEmployee.angajatId : null,
      serviciuId: selectedService ? selectedService.serviciuId : null,
      dataProgramare: formatDate(formState.data),
      oraProgramare: `${formState.ora}:00`,
      nume: formState.nume,
      prenume: formState.prenume,
      telefon: formState.telefon,
    };
  
    try {
      if (isAdding) {
        await axios.post('http://localhost:5050/api/programari', payload);
      } else {
        await axios.put(`http://localhost:5050/api/programari/${formState.programareId}`, payload);
      }
      onSave(payload);
      setIsSubmitting(false);
      onClose();
    } catch (error) {
      console.error('Eroare la actualizarea programării:', error);
      if (error.response && error.response.data.message === 'Utilizatorul nu este autentificat') {
        payload.clientId = null; 
        await axios.post('http://localhost:5050/api/programari', payload);
        onSave(payload);
        setIsSubmitting(false);
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="edit-programare">
      <form className="edit-programare-form-edit-programare " onSubmit={handleSave}>
        <h2>{isAdding ? 'Adaugă programare' : 'Editează programarea'}</h2>
        <div className="form-group-edit-programare">
          <input
            type="text"
            name="nume"
            placeholder="Nume"
            value={formState.nume}
            onChange={handleChange}
            readOnly={formState.clientId !== 0}
          />
          {errors.nume && <span className="error-message-edit-programare">{errors.nume}</span>}
        </div>
        <div className="form-group-edit-programare">
          <input
            type="text"
            name="prenume"
            placeholder="Prenume"
            value={formState.prenume}
            onChange={handleChange}
            readOnly={formState.clientId !== 0}
          />
          {errors.prenume && <span className="error-message-edit-programare">{errors.prenume}</span>}
        </div>
        <div className="form-group-edit-programare">
          <input
            type="text"
            name="telefon"
            placeholder="Telefon"
            value={formState.telefon}
            onChange={handleChange}
            readOnly={formState.clientId !== 0}
          />
          {errors.telefon && <span className="error-message-edit-programare">{errors.telefon}</span>}
        </div>
        <div className="form-group-edit-programare">
          <select
            name="serviciu"
            value={formState.serviciu}
            onChange={handleChange}
            className="select-edit-programare"
          >
            <option value="">Selectează un serviciu</option>
            {services.map((service) => (
              <option key={service.serviciuId} value={service.denumire}>
                {service.denumire}
              </option>
            ))}
          </select>
          {errors.serviciu && <span className="error-message-edit-programare">{errors.serviciu}</span>}
        </div>
        <div className="form-group-edit-programare">
          <select
            name="angajat"
            value={formState.angajat}
            onChange={handleChange}
            className="select-edit-programare"
          >
            <option value="">Selectează un angajat</option>
            {employees.map((employee) => (
              <option key={employee.angajatId} value={`${employee.nume} ${employee.prenume}`}>
                {employee.nume} {employee.prenume}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group-edit-programare">
          <DatePicker
            selected={formState.data}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            locale="ro"
            className="date-picker-edit-programare"
          />
        </div>
        <div className="form-group-edit-programare">
          <input
            type="time"
            name="ora"
            placeholder="Ora"
            value={formState.ora}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="save-button-edit-programare" disabled={isSubmitting}>
          <FontAwesomeIcon icon={faSave} /> {isAdding ? 'Salvează programarea' : 'Salvează modificările'}
        </button>
      </form>
    </div>
  );
};

const formatDate = (date) => {
  const an = date.getFullYear();
  const luna = (date.getMonth() + 1).toString().padStart(2, '0');
  const zi = date.getDate().toString().padStart(2, '0');
  return `${an}-${luna}-${zi}`;
};

const parseDate = (date) => {
  if (typeof date === 'string') {
    const [zi, luna, an] = date.split('/');
    return new Date(`${an}-${luna}-${zi}`);
  }
  return date;
};

export default EditProgramare;
