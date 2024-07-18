import React, { useState, useEffect, useCallback } from 'react';
import './ZileLibere.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faSave, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import ModalZileLibere from './modalZileLibere/ModalZileLibere';
import DatePicker, { registerLocale } from 'react-datepicker';
import ro from 'date-fns/locale/ro';
import 'react-datepicker/dist/react-datepicker.css';
import ConfirmDialog from '../confirmDialog/ConfirmDialog'; 

registerLocale('ro', ro);

const ZileLibere = ({ token }) => {
  const [daysOff, setDaysOff] = useState([]);
  const [formState, setFormState] = useState({ id: null, date: new Date(), reason: '' });
  const [errors, setErrors] = useState({ date: '', reason: '' });
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Adaugă o zi liberă');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, id: null });  

  const fetchDaysOff = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/zilelibere', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const formattedData = response.data.map(day => ({
        ...day,
        date: formatDate(day.dataZiLibera),
      })).sort((a, b) => new Date(a.date) - new Date(b.date));
      setDaysOff(formattedData);
    } catch (error) {
      console.error('Eroare la preluarea zilelor libere:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchDaysOff();
  }, [fetchDaysOff]);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = (`0${d.getDate()}`).slice(-2);
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (date) => {
    const [day, month, year] = date.split('/');
    return new Date(`${year}-${month}-${day}`);
  };

  const validate = () => {
    const newErrors = {};
    if (!formState.date) newErrors.date = 'Data este obligatorie.';
    if (!formState.reason.match(/^[a-zA-ZăâîșțĂÂÎȘȚ\s]+(\s*[a-zA-ZăâîșțĂÂÎȘȚ]*)*$/)) newErrors.reason = 'Motivul poate conține doar litere și spații.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleDateChange = (date) => {
    setFormState({
      ...formState,
      date
    });
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      const payload = {
        dataZiLibera: formState.date,
        motiv: formState.reason
      };

      if (isEditing) {
        await axios.put(`http://localhost:5050/api/zilelibere/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5050/api/zilelibere', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      await fetchDaysOff();
      setFormState({ id: null, date: new Date(), reason: '' });
      setEditingId(null);
      setIsEditing(false);
      setShowModal(false);
      setErrors({ date: '', reason: '' });
    } catch (error) {
      console.error('Eroare la salvarea zilei libere:', error);
    }
  };

  const handleEdit = (day) => {
    setFormState({
      id: day.ziLiberaId,
      date: parseDate(day.date),
      reason: day.motiv
    });
    setEditingId(day.ziLiberaId);
    setIsEditing(true);
    setShowModal(true);
    setModalTitle('Modifică o zi liberă');
  };

  const handleDelete = (id) => {
    setConfirmDialog({ isOpen: true, id });  
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5050/api/zilelibere/${confirmDialog.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchDaysOff();
      setConfirmDialog({ isOpen: false, id: null });  
    } catch (error) {
      console.error('Eroare la ștergerea zilei libere:', error);
    }
  };

  const handleAdd = () => {
    setFormState({ id: null, date: new Date(), reason: '' });
    setEditingId(null);
    setIsEditing(false);
    setShowModal(true);
    setModalTitle('Adaugă o zi liberă');
  };

  return (
    <div className="zile-libere">
      <h2>Zile Libere</h2>
      <table className="tabel-zile-libere">
        <thead>
          <tr>
            <th>Data</th>
            <th>Motiv</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {daysOff.map((day) => (
            <tr key={day.ziLiberaId}>
              <td>{day.date}</td>
              <td>{day.motiv}</td>
              <td>
                <button className="edit-button-zile-libere" onClick={() => handleEdit(day)}>
                  <FontAwesomeIcon icon={faEdit} /> Editează
                </button>
                <button className="delete-button-zile-libere" onClick={() => handleDelete(day.ziLiberaId)}>
                  <FontAwesomeIcon icon={faTrashAlt} /> Șterge
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-button-zile-libere" onClick={handleAdd}>
        <FontAwesomeIcon icon={faPlus} /> Adaugă Zi Liberă
      </button>

      <ModalZileLibere show={showModal} onClose={() => setShowModal(false)}>
        <div className="form-zile-libere">
          <h2>{modalTitle}</h2>
          <div className="form-group-zile-libere">
            <p>Data</p>
            <DatePicker
              selected={formState.date}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              locale="ro"
              className="date-picker-zile-libere"
            />
            {errors.date && <span className="error-message-zile-libere">{errors.date}</span>}
          </div>
          <div className="form-group-zile-libere">
            <p>Motiv</p>
            <input
              type="text"
              name="reason"
              value={formState.reason}
              onChange={handleChange}
              className="input-text-zile-libere"
              placeholder='Introduceți motivul...'
            />
            {errors.reason && <span className="error-message-zile-libere">{errors.reason}</span>}
          </div>
          <button className="save-button-zile-libere" onClick={handleSave}>
            <FontAwesomeIcon icon={faSave} /> Salvează
          </button>
        </div>
      </ModalZileLibere>

      {confirmDialog.isOpen && (
        <ConfirmDialog
          message="Ești sigur că vrei să ștergi această zi liberă?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
        />
      )}
    </div>
  );
};

export default ZileLibere;
