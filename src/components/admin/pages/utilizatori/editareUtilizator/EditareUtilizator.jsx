import React, { useState, useEffect, useRef } from 'react';
import './EditareUtilizator.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faPlus } from '@fortawesome/free-solid-svg-icons';

const EditareUtilizator = ({ user, onSave, isAdding }) => {
  const [clientData, setClientData] = useState({
    nume: '',
    prenume: '',
    telefon: '',
    email: '',
    poza: '',
    rol: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      const { utilizator_id, ...userData } = user;
      setClientData(userData);
      setImagePreview(user.poza ? `data:image/jpeg;base64,${user.poza}` : null);
    } else {
      setClientData({ nume: '', prenume: '', telefon: '', email: '', poza: '', rol: '' });
      setImagePreview(null);
    }
  }, [user]);

  const validate = () => {
    const errors = {};
    const namePattern = /^[A-Za-z]+$/;
    const phonePattern = /^\d{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!clientData.nume) {
      errors.nume = 'Numele este obligatoriu';
    } else if (!namePattern.test(clientData.nume)) {
      errors.nume = 'Numele poate conține doar litere';
    }

    if (!clientData.prenume) {
      errors.prenume = 'Prenumele este obligatoriu';
    } else if (!namePattern.test(clientData.prenume)) {
      errors.prenume = 'Prenumele poate conține doar litere';
    }

    if (!clientData.telefon) {
      errors.telefon = 'Telefonul este obligatoriu';
    } else if (!phonePattern.test(clientData.telefon)) {
      errors.telefon = 'Telefonul trebuie să conțină exact 10 cifre';
    }

    if (!clientData.email) {
      errors.email = 'Emailul este obligatoriu';
    } else if (!emailPattern.test(clientData.email)) {
      errors.email = 'Emailul nu este valid (de ex. exemplu@exemplu.com)';
    }

    if (!clientData.rol) {
      errors.rol = 'Rolul este obligatoriu';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        const byteArray = Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0));
        setImagePreview(reader.result);
        setClientData((prevData) => ({
          ...prevData,
          poza: byteArray,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (validate()) {
        const token = localStorage.getItem('token'); 
  
        try {
            console.log(clientData.email);
            const response = await fetch(`http://localhost:5050/admin/users/${clientData.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(clientData)
            });
  
            if (response.ok) {
                onSave(clientData);
                setClientData({ nume: '', prenume: '', telefon: '', email: '', poza: '', rol: '' });
                setImagePreview(null);
            } else {
                console.error('Nu s-au salvat datele utilizatorului');
            }
        } catch (error) {
            console.error('Eroare la salvarea datelor utilizatorului:', error);
        }
    }
};

  

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="edit-client-editare-utilizator-admin">
      <h2>{isAdding ? 'Adaugă datele clientului' : 'Editează profilul utilizatorului'}</h2>
      <form onSubmit={handleSave}>
        <div className="form-group-editare-utilizator-admin">
          <label>Nume</label>
          <input
            type="text"
            name="nume"
            value={clientData.nume}
            onChange={handleChange}
          />
          {errors.nume && <span className="error-message-editare-utilizator-admin">{errors.nume}</span>}
        </div>
        <div className="form-group-editare-utilizator-admin">
          <label>Prenume</label>
          <input
            type="text"
            name="prenume"
            value={clientData.prenume}
            onChange={handleChange}
          />
          {errors.prenume && <span className="error-message-editare-utilizator-admin">{errors.prenume}</span>}
        </div>
        <div className="form-group-editare-utilizator-admin">
          <label>Telefon</label>
          <input
            type="text"
            name="telefon"
            value={clientData.telefon}
            onChange={handleChange}
          />
          {errors.telefon && <span className="error-message-editare-utilizator-admin">{errors.telefon}</span>}
        </div>
        <div className="form-group-editare-utilizator-admin">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={clientData.email}
            onChange={handleChange}
            readOnly={!isAdding}
          />
          {errors.email && <span className="error-message-editare-utilizator-admin">{errors.email}</span>}
        </div>
        <div className="form-group-editare-utilizator-admin">
          <label>Rol</label>
          <select name="rol" value={clientData.rol} onChange={handleChange}>
            <option value="ROLE_ADMIN">ROLE_ADMIN</option>
            <option value="ROLE_ANGAJAT">ROLE_ANGAJAT</option>
            <option value="ROLE_CLIENT">ROLE_CLIENT</option>
          </select>
          {errors.rol && <span className="error-message-editare-utilizator-admin">{errors.rol}</span>}
        </div>
        <div className="form-group-editare-utilizator-admin">
          <label className="upload-label-editare-utilizator-admin" onClick={triggerFileInput}>
            <div className="upload-placeholder-editare-utilizator-admin">
              {imagePreview ? (
                <img src={imagePreview} alt="Client" />
              ) : (
                <FontAwesomeIcon icon={faPlus} />
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
          </label>
          <span>Încarcă o imagine</span>
        </div>
        <button type="submit" className="save-button-editare-utilizator-admin">
          <FontAwesomeIcon icon={faSave} /> Salvează
        </button>
      </form>
    </div>
  );
};

export default EditareUtilizator;
