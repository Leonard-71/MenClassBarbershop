import React, { useState, useEffect } from 'react';
import './AdaugaProgramare.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import DatePicker, { registerLocale } from "react-datepicker";
import ro from "date-fns/locale/ro";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("ro", ro);

const AdaugaProgramare = ({ appointment, onSave, onClose, isAdding }) => {
  const initialFormState = {
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
  };

  const [formState, setFormState] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchServices();
  }, []);

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
      onSave(payload);
      setIsSubmitting(false);
      onClose();
    } catch (error) {
      console.error('Eroare la adăugarea programării:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="adauga-programare">
      <form className="adauga-programare-form" onSubmit={handleSave}>
        <h2>Adaugă programare</h2>
        <div className="form-group-adauga-programare">
          <input
            type="text"
            name="nume"
            placeholder="Nume"
            value={formState.nume}
            onChange={handleChange}
          />
          {errors.nume && <span className="error-message-adauga-programare">{errors.nume}</span>}
        </div>
        <div className="form-group-adauga-programare">
          <input
            type="text"
            name="prenume"
            placeholder="Prenume"
            value={formState.prenume}
            onChange={handleChange}
          />
          {errors.prenume && <span className="error-message-adauga-programare">{errors.prenume}</span>}
        </div>
        <div className="form-group-adauga-programare">
          <input
            type="text"
            name="telefon"
            placeholder="Telefon"
            value={formState.telefon}
            onChange={handleChange}
          />
          {errors.telefon && <span className="error-message-adauga-programare">{errors.telefon}</span>}
        </div>
        <div className="form-group-adauga-programare">
          <select
            name="serviciu"
            value={formState.serviciu}
            onChange={handleChange}
            className="select-adauga-programare"
          >
            <option value="">Selectează un serviciu</option>
            {services.map((service) => (
              <option key={service.serviciuId} value={service.denumire}>
                {service.denumire}
              </option>
            ))}
          </select>
          {errors.serviciu && <span className="error-message-adauga-programare">{errors.serviciu}</span>}
        </div>
        <div className="form-group-adauga-programare">
          <select
            name="angajat"
            value={formState.angajat}
            onChange={handleChange}
            className="select-adauga-programare"
          >
            <option value="">Selectează un angajat</option>
            {employees.map((employee) => (
              <option key={employee.angajatId} value={`${employee.nume} ${employee.prenume}`}>
                {employee.nume} {employee.prenume}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group-adauga-programare">
          <DatePicker
            selected={formState.data}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            locale="ro"
            className="date-picker-adauga-programare"
          />
        </div>
        <div className="form-group-adauga-programare">
          <input
            type="time"
            name="ora"
            placeholder="Ora"
            value={formState.ora}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="save-button-adauga-programare" disabled={isSubmitting}>
          <FontAwesomeIcon icon={faSave} /> Salvează programarea
        </button>
      </form>
    </div>
  );
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default AdaugaProgramare;
