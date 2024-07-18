import React, { useState, useEffect, useCallback } from 'react';
import './Angajati.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faSave, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import ConfirmDialog from '../confirmDialog/ConfirmDialog';

const Angajati = ({ token }) => {
  const [employees, setEmployees] = useState([]);
  const [formState, setFormState] = useState({
    nume: '',
    prenume: '',
    functie: '',
    telefon: '',
    linkInstagram: '',
    linkFacebook: '',
    descriere: '',
    poza: ''
  });
  const [errors, setErrors] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, index: null });

  const loadEmployees = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/angajati', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Eroare la preluarea angajatului:', error);
    }
  }, [token]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setFormState({
          ...formState,
          poza: base64String
        });
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formState.functie) {
      newErrors.functie = 'Funcția este obligatorie.';
    } else if (!/^[A-Za-z]+$/.test(formState.functie)) {
      newErrors.functie = 'Funcția trebuie să conțină doar litere.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    const payload = {
      functie: formState.functie,
      linkInstagram: formState.linkInstagram,
      linkFacebook: formState.linkFacebook,
      descriere: formState.descriere,
      poza: formState.poza
    };

    try {
      if (editingIndex !== null) {
        await axios.put(`http://localhost:5050/api/angajati/${employees[editingIndex].angajatId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        await axios.post('http://localhost:5050/api/angajati', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      await loadEmployees();
      setFormState({
        nume: '',
        prenume: '',
        functie: '',
        telefon: '',
        linkInstagram: '',
        linkFacebook: '',
        descriere: '',
        poza: ''
      });
      setPreviewImage('');
      setIsFormVisible(false);
      setEditingIndex(null);
    } catch (error) {
      console.error('Eroare la salvarea angajatului:', error);
    }
  };

  const handleEdit = (index) => {
    const employee = employees[index];
    setFormState({
      nume: employee.nume,
      prenume: employee.prenume,
      functie: employee.functie,
      telefon: employee.telefon,
      linkInstagram: employee.linkInstagram,
      linkFacebook: employee.linkFacebook,
      descriere: employee.descriere,
      poza: employee.poza ? employee.poza : ''
    });
    setPreviewImage(employee.poza ? `data:image/jpeg;base64,${employee.poza}` : '');
    setEditingIndex(index);
    setIsFormVisible(true);
  };

  const handleDelete = (index) => {
    setConfirmDialog({ isOpen: true, index });
  };

  const confirmDelete = async () => {
    const angajatId = employees[confirmDialog.index]?.angajatId;
  
    try {
      const response = await axios.delete(`http://localhost:5050/api/angajati/${angajatId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.status === 200) {
        const updatedEmployees = employees.filter((_, index) => index !== confirmDialog.index);
        setEmployees(updatedEmployees);
        setConfirmDialog({ isOpen: false, index: null });
      } else {
        console.error(`Cod de stare neașteptat: ${response.status}`);
      }
    } catch (error) {
      console.error('Eroare la ștergerea angajatului:', error);
    }
  };

  const handleCancel = () => {
    setFormState({
      nume: '',
      prenume: '',
      functie: '',
      telefon: '',
      linkInstagram: '',
      linkFacebook: '',
      descriere: '',
      poza: ''
    });
    setPreviewImage('');
    setIsFormVisible(false);
    setEditingIndex(null);
  };

  return (
    <div className="employee-management">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Nume</th>
            <th>Prenume</th>
            <th>Funcție</th>
            <th>Telefon</th>
            <th>Descriere</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index}>
              <td>{employee.nume}</td>
              <td>{employee.prenume}</td>
              <td>{employee.functie}</td>
              <td>{employee.telefon}</td>
              <td>{employee.descriere}</td>
              <td>
                <button className="edit-button-angajati-admin" onClick={() => handleEdit(index)}>
                  <FontAwesomeIcon icon={faEdit} /> Editează
                </button>
                <button className="delete-button-angajati-admin" onClick={() => handleDelete(index)}>
                  <FontAwesomeIcon icon={faTrashAlt} /> Șterge
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isFormVisible && (
        <div className="form-angajati-admin">
          <div className="image-upload-angajati-admin">
            <input type="file" name="poza" onChange={handleImageChange} />
            {previewImage ? (
              <img src={previewImage} alt="Preview" className="image-preview-angajati-admin" />
            ) : (
              <>
                <FontAwesomeIcon icon={faPlus} className="icon-angajati-admin" />
                <span className="image-upload-text-angajati-admin">Încarcă o imagine</span>
              </>
            )}
          </div>
          <div className="form-fields-angajati-admin">
            <div className="form-group-angajati-admin">
              <label>Nume</label>
              <input type="text" name="nume" value={formState.nume} onChange={handleChange} disabled={editingIndex !== null} />
            </div>
            <div className="form-group-angajati-admin">
              <label>Prenume</label>
              <input type="text" name="prenume" value={formState.prenume} onChange={handleChange} disabled={editingIndex !== null} />
            </div>
            <div className="form-group-angajati-admin">
              <label>Funcție</label>
              <input type="text" name="functie" value={formState.functie} onChange={handleChange} />
              {errors.functie && <span className="error-message">{errors.functie}</span>}
            </div>
            <div className="form-group-angajati-admin">
              <label>Telefon</label>
              <input type="text" name="telefon" value={formState.telefon} onChange={handleChange} disabled={editingIndex !== null} />
            </div>
            <div className="form-group-angajati-admin">
              <label>Instagram</label>
              <input type="text" name="linkInstagram" value={formState.linkInstagram} onChange={handleChange} />
            </div>
            <div className="form-group-angajati-admin">
              <label>Facebook</label>
              <input type="text" name="linkFacebook" value={formState.linkFacebook} onChange={handleChange} />
            </div>
          </div>
          <div className="description-field-angajati-admin">
            <label>Descriere</label>
            <textarea name="descriere" value={formState.descriere} onChange={handleChange}></textarea>

            <div className="form-buttons-angajati-admin">
              <button className="cancel-button-angajati-admin" onClick={handleCancel}>
                <FontAwesomeIcon icon={faTimes} /> Renunță
              </button>
              <button className="save-button-angajati-admin" onClick={handleSave}>
                <FontAwesomeIcon icon={faSave} /> Salvează
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDialog.isOpen && (
        <ConfirmDialog
          message="Ești sigur că vrei să ștergi acest angajat?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDialog({ isOpen: false, index: null })}
        />
      )}
    </div>
  );
};

export default Angajati;
