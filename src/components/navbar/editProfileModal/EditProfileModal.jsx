import React, { useState, useEffect } from 'react';
import './EditProfileModal.scss';

const EditProfileModal = ({ onClose, onProfileUpdated }) => { 
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    nume: '',
    prenume: '',
    telefon: '',
    poza: null
  });
  const [errors, setErrors] = useState({
    nume: '',
    prenume: '',
    telefon: ''
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5050/api/loggeduser/details', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (response.ok) {
          setFormData({
            email: result.email,
            nume: result.nume,
            prenume: result.prenume,
            telefon: result.telefon,
            poza: result.poza || null
          });
          if (result.poza) {
            setProfileImage(`data:image/jpeg;base64,${result.poza}`);
          }
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error('Eroare la preluarea datelor de profil:', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let valid = true;
    let errors = {};

    if (!formData.nume) {
      errors.nume = 'Numele este obligatoriu';
      valid = false;
    } else if (!/^[a-zA-Z\s-]+$/.test(formData.nume)) {
      errors.nume = 'Numele poate conține doar litere, spații și cratime';
      valid = false;
    }

    if (!formData.prenume) {
      errors.prenume = 'Prenumele este obligatoriu';
      valid = false;
    } else if (!/^[a-zA-Z\s-]+$/.test(formData.prenume)) {
      errors.prenume = 'Prenumele poate conține doar litere, spații și cratime';
      valid = false;
    }

    if (!formData.telefon) {
      errors.telefon = 'Numărul de telefon este obligatoriu';
      valid = false;
    } else if (!/^\d{10,13}$/.test(formData.telefon)) {
      errors.telefon = 'Numărul de telefon trebuie să conțină între 10 și 13 cifre';
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const token = localStorage.getItem('token');
      const email = formData.email; 
      try {
        const payload = {
          nume: formData.nume,
          prenume: formData.prenume,
          telefon: formData.telefon,
          poza: formData.poza,  
        };
  
        const response = await fetch(`http://localhost:5050/admin/users/${email}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
  
        const result = await response.json().catch(() => null);
        if (response.ok) {
          onProfileUpdated();  
          onClose();
        } else {
          console.error(result ? result.message : 'Eroare la actualizarea profilului');
        }
      } catch (error) {
        console.error('Eroare la actualizarea profilului:', error);
      }
    }
  };
  

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      setFormData({
        ...formData,
        poza: base64String
      });
      setProfileImage(`data:image/jpeg;base64,${base64String}`);  
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-edit-profile">
        <div className='rectangle-37'></div>
        <div className="title-edit-profile">MEN CLASS</div>
        <button className="close-modal" onClick={onClose}>&times;</button>
        <div className="form-container">
          <div className="image-upload">
            <label htmlFor="profileImage" className="image-upload-label">
              <div className="image-preview" style={{ backgroundImage: `url(${profileImage || ''})` }}>
                {!profileImage && <span className="upload-icon">+</span>}
              </div>
              <span className='text-span'>Încărcă imaginea de profil</span>
            </label>
            <input type="file" id="profileImage" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="nume">Nume</label>
              <input 
                type="text" 
                id="nume" 
                name="nume" 
                placeholder="Introduceți numele dumneavoastră" 
                value={formData.nume}
                onChange={handleInputChange}
              />
              {errors.nume && <div className="error">{errors.nume}</div>}
            </div>
            <div className="input-group">
              <label htmlFor="prenume">Prenume</label>
              <input 
                type="text" 
                id="prenume" 
                name="prenume" 
                placeholder="Introduceți prenumele dumneavoastră" 
                value={formData.prenume}
                onChange={handleInputChange}
              />
              {errors.prenume && <div className="error">{errors.prenume}</div>}
            </div>
            <div className="input-group">
              <label htmlFor="telefon">Număr de telefon</label>
              <input 
                type="text" 
                id="telefon" 
                name="telefon" 
                placeholder="Introduceți un număr de telefon" 
                value={formData.telefon}
                onChange={handleInputChange}
              />
              {errors.telefon && <div className="error">{errors.telefon}</div>}
            </div>
            <div className="creare-cont-button-container">
              <button type="submit" className="creare-cont-button">Salvează</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
