import React, { useState, useEffect, useCallback } from 'react';
import './Program.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import { fetchProgramLucru, addProgramLucru, updateProgramLucru } from '../../../../Service/program';
import '../fereastraAtentionare/Fereastra.scss';

const Program = ({ token }) => {  
  const [schedule, setSchedule] = useState([]);
  const [formState, setFormState] = useState({ denumire: '', oraDeschidere: '', oraInchidere: '' });
  const [errors, setErrors] = useState({ denumire: '', oraDeschidere: '', oraInchidere: '' });
  const [editingDenumire, setEditingDenumire] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const program = useCallback(async () => {
    try {
      const data = await fetchProgramLucru();
      const formattedData = data.map(item => ({
        ...item,
        oraDeschidere: formatTime(item.oraDeschidere),
        oraInchidere: formatTime(item.oraInchidere)
      }));
      setSchedule(sortScheduleByDays(formattedData));
    } catch (error) {
      console.error('Error fetching program de lucru:', error);
    }
  }, []);

  useEffect(() => {
    program();
  }, [program]);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    return `${parseInt(hours)}:${minutes}`;
  };

  const formatTimeForBackend = (time) => {
    if (time.length === 4) {
      return `${time}:00`;
    } else if (time.length === 5) {
      return `${time}:00`;
    }
    return time;
  };

  const validateTime = (time) => {
    const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timePattern.test(time);
  };

  const validateDay = (day) => {
    const validDays = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];
    return validDays.includes(day);
  };

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = '';

    if (name === 'oraDeschidere' || name === 'oraInchidere') {
      if (!validateTime(value)) {
        errorMessage = 'Vă rog să folosiți formatul HH:MM sau H:MM';
      }
    }

    if (name === 'denumire') {
      if (!validateDay(value)) {
        errorMessage = 'Ziua trebuie să fie una dintre: Luni, Marți, Miercuri, Joi, Vineri, Sâmbătă, Duminică';
      }
    }

    setErrors({
      ...errors,
      [name]: errorMessage
    });

    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleSave = async () => {
    if (!validateDay(formState.denumire)) {
      showAlert('Ziua trebuie să fie una dintre: Luni, Marți, Miercuri, Joi, Vineri, Sâmbătă, Duminică');
      return;
    }
    if (!validateTime(formState.oraDeschidere) || !validateTime(formState.oraInchidere)) {
      showAlert('Vă rog să folosiți formatul HH:MM sau H:MM');
      return;
    }
    if (timeToMinutes(formState.oraDeschidere) > timeToMinutes(formState.oraInchidere)) {
      showAlert('Ora de închidere nu poate fi înainte de ora deschiderii');
      return;
    }
  
    try {
      const formattedData = {
        ...formState,
        oraDeschidere: formatTimeForBackend(formState.oraDeschidere),
        oraInchidere: formatTimeForBackend(formState.oraInchidere)
      };
  
      if (isEditing) {
        await updateProgramLucru(editingDenumire, formattedData, token); 
      } else {
        await addProgramLucru(formattedData, token);  
      }
      await program();
      setFormState({ denumire: '', oraDeschidere: '', oraInchidere: '' });
      setEditingDenumire(null);
      setIsEditing(false);
      setErrors({ denumire: '', oraDeschidere: '', oraInchidere: '' });
    } catch (error) {
      console.error('Eroare la salvarea programului de lucru: ', error);
    }
  };
  
  const showAlert = (message) => {
    const alertPopup = document.createElement('div');
    alertPopup.className = 'custom-popup';
    alertPopup.innerHTML = `
      <p>${message}</p>
      <button onclick="this.parentElement.remove()">OK</button>
    `;
    document.body.appendChild(alertPopup);
  };
  
  const handleEdit = (denumire) => {
    const toEdit = schedule.find(s => s.denumire === denumire);
    setFormState({
      denumire: toEdit.denumire,
      oraDeschidere: toEdit.oraDeschidere,
      oraInchidere: toEdit.oraInchidere
    });
    setEditingDenumire(denumire);
    setIsEditing(true);
  };

  const sortScheduleByDays = (schedule) => {
    const dayOrder = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];
    return schedule.sort((a, b) => dayOrder.indexOf(a.denumire) - dayOrder.indexOf(b.denumire));
  };

  return (
    <div className="program">
      <h2>Program</h2>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>ZI</th>
            <th>ORĂ DESCHIDERE</th>
            <th>ORĂ ÎNCHIDERE</th>
            <th>ACȚIUNI</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((s, index) => (
            <tr key={index}>
              <td>{s.denumire}</td>
              <td>{s.oraDeschidere === s.oraInchidere ? 'Închis' : s.oraDeschidere}</td>
              <td>{s.oraDeschidere === s.oraInchidere ? '' : s.oraInchidere}</td>
              <td>
                <button className="edit-button-program-admin" onClick={() => handleEdit(s.denumire)}>
                  <FontAwesomeIcon icon={faEdit} /> Editează
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditing && (
        <div className="form-program-admin">
          <div className="form-group-program-admin">
            <label>ZI</label>
            <input type="text" name="denumire" value={formState.denumire} onChange={handleChange} />
            {errors.denumire && <span className="error-message-program-admin">{errors.denumire}</span>}
          </div>
          <div className="form-group-program-admin">
            <label>ORĂ DESCHIDERE</label>
            <input type="text" name="oraDeschidere" value={formState.oraDeschidere} onChange={handleChange} />
            {errors.oraDeschidere && <span className="error-message-program-admin">{errors.oraDeschidere}</span>}
          </div>
          <div className="form-group-program-admin">
            <label>ORĂ ÎNCHIDERE</label>
            <input type="text" name="oraInchidere" value={formState.oraInchidere} onChange={handleChange} />
            {errors.oraInchidere && <span className="error-message-program-admin">{errors.oraInchidere}</span>}
          </div>
          <button className="save-button-program-admin" onClick={handleSave}>
            <FontAwesomeIcon icon={faSave} /> Salvează
          </button>
        </div>
      )}
    </div>
  );
};

export default Program;
