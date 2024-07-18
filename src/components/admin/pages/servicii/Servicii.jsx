import React, { useState, useEffect } from 'react';
import './Servicii.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faSave, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { fetchServicii, addServiciu, updateServiciu, deleteServiciu } from '../../../../Service/servicii';
import ConfirmDialog from '../confirmDialog/ConfirmDialog';

const Servicii = ({ token }) => {
  const [services, setServices] = useState([]);
  const [formState, setFormState] = useState({ denumire: '', descriereServiciu: '', durata: '', pret: '' });
  const [errors, setErrors] = useState({ denumire: '', descriereServiciu: '', durata: '', pret: '' });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, id: null });

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchServicii();
        setServices(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formState.denumire) {
      newErrors.denumire = 'Denumirea este obligatorie.';
    } else if (!/^[A-Za-z\s]+$/.test(formState.denumire)) {
      newErrors.denumire = 'Denumirea trebuie să conțină doar litere și spații.';
    }

    if (!formState.durata) {
      newErrors.durata = 'Durata este obligatorie.';
    } else if (!/^\d+$/.test(formState.durata)) {
      newErrors.durata = 'Durata trebuie să fie în minute și să conțină doar cifre.';
    }

    if (!formState.pret) {
      newErrors.pret = 'Prețul este obligatoriu.';
    } else if (!/^\d+$/.test(formState.pret)) {
      newErrors.pret = 'Prețul trebuie să conțină doar cifre.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    try {
      if (editingIndex !== null) {
        await updateServiciu(services[editingIndex].serviciuId, formState, token);
        setEditingIndex(null);
      } else {
        await addServiciu(formState, token);
      }

      const data = await fetchServicii();
      setServices(data);

      setFormState({ denumire: '', descriereServiciu: '', durata: '', pret: '' });
      setIsFormVisible(false);
    } catch (error) {
      console.error("Eroare la salvarea serviciului: ", error);
    }
  };

  const handleEdit = (index) => {
    setFormState(services[index]);
    setEditingIndex(index);
    setIsFormVisible(true);
  };

  const handleDelete = (serviciuId) => {
    setConfirmDialog({ isOpen: true, id: serviciuId });
  };

  const confirmDelete = async () => {
    try {
      await deleteServiciu(confirmDialog.id, token);
      setServices(services.filter(service => service.serviciuId !== confirmDialog.id));
      setConfirmDialog({ isOpen: false, id: null });
    } catch (error) {
      console.error("Eroare la ștergerea serviciului: ", error);
    }
  };

  const handleAddService = () => {
    setFormState({ denumire: '', descriereServiciu: '', durata: '', pret: '' });
    setEditingIndex(null);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setFormState({ denumire: '', descriereServiciu: '', durata: '', pret: '' });
    setIsFormVisible(false);
    setEditingIndex(null);
  };

  if (loading) {
    return <div>Se incarca...</div>;
  }

  if (error) {
    return <div>Eroare: {error}</div>;
  }

  return (
    <div className="servicii">
      <h2>Servicii</h2>
      <button className="add-button" onClick={handleAddService}>
        <FontAwesomeIcon icon={faPlus} /> Adaugă Serviciu
      </button>
      <table className="services-table">
        <thead>
          <tr>
            <th>Denumire</th>
            <th>Descriere</th>
            <th>Durată</th>
            <th>Preț</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service, index) => (
            <tr key={index}>
              <td>{service.denumire}</td>
              <td>{service.descriereServiciu}</td>
              <td>{service.durata}</td>
              <td>{service.pret}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(index)}>
                  <FontAwesomeIcon icon={faEdit} /> Editează
                </button>
                <button className="delete-button" onClick={() => handleDelete(service.serviciuId)}>
                  <FontAwesomeIcon icon={faTrashAlt} /> Șterge
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isFormVisible && (
        <div className="form">
          <div className="form-group">
            <label>Denumire</label>
            <input type="text" name="denumire" value={formState.denumire} onChange={handleChange} />
            {errors.denumire && <span className="error-message">{errors.denumire}</span>}
          </div>
          <div className="form-group">
            <label>Durată</label>
            <input type="text" name="durata" value={formState.durata} onChange={handleChange} />
            {errors.durata && <span className="error-message">{errors.durata}</span>}
          </div>
          <div className="form-group">
            <label>Descriere</label>
            <textarea name="descriereServiciu" value={formState.descriereServiciu} onChange={handleChange}></textarea>
          </div>
          <div className="form-group">
            <label>Preț</label>
            <input type="text" name="pret" value={formState.pret} onChange={handleChange} />
            {errors.pret && <span className="error-message">{errors.pret}</span>}
          </div>
          <div className="form-buttons">
            <button className="cancel-button" onClick={handleCancel}>
              <FontAwesomeIcon icon={faTimes} /> Renunță
            </button>
            <button className="save-button" onClick={handleSave}>
              <FontAwesomeIcon icon={faSave} /> {editingIndex !== null ? 'Salvează' : 'Adaugă'}
            </button>
          </div>
        </div>
      )}

      {confirmDialog.isOpen && (
        <ConfirmDialog
          message="Ești sigur că vrei să ștergi acest serviciu?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
        />
      )}
    </div>
  );
};

export default Servicii;
