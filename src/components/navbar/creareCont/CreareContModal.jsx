import React, { useState } from "react";
import "./CreareContModal.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const CreareContModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    nume: "",
    prenume: "",
    email: "",
    telefon: "",
    password: "",
    passwordConfirmed: "",
  });
  const [errors, setErrors] = useState({
    nume: "",
    prenume: "",
    email: "",
    telefon: "",
    password: "",
    passwordConfirmed: "",
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!formData.nume) {
      newErrors.nume = "Numele este obligatoriu";
      valid = false;
    } else if (!/^[a-zA-Z\s-]+$/.test(formData.nume)) {
      newErrors.nume = "Numele poate conține doar litere, spații și cratime";
      valid = false;
    }

    if (!formData.prenume) {
      newErrors.prenume = "Prenumele este obligatoriu";
      valid = false;
    } else if (!/^[a-zA-Z\s-]+$/.test(formData.prenume)) {
      newErrors.prenume =
        "Prenumele poate conține doar litere, spații și cratime";
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = "Emailul este obligatoriu";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email =
        "Emailul nu este valid; trebuie să conțină un simbol @ și un domeniu";
      valid = false;
    }

    if (!formData.telefon) {
      newErrors.telefon = "Numărul de telefon este obligatoriu";
      valid = false;
    } else if (!/^\d{10,13}$/.test(formData.telefon)) {
      newErrors.telefon =
        "Numărul de telefon trebuie să conțină între 10 și 13 cifre";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Parola este obligatorie";
      valid = false;
    }

    if (!formData.passwordConfirmed) {
      newErrors.passwordConfirmed = "Confirmați parola";
      valid = false;
    } else if (formData.password.trim() !== formData.passwordConfirmed.trim()) {
      newErrors.passwordConfirmed = "Parolele nu se potrivesc";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:5050/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const responseData = await response.json();
          setMessage("Cont creat cu succes!");
          localStorage.setItem("accessToken", responseData.token);
          setFormData({
            nume: "",
            prenume: "",
            email: "",
            telefon: "",
            password: "",
            passwordConfirmed: "",
          });
        } else {
          const errorData = await response.json();
          setMessage(errorData.message || "A apărut o problemă!");
        }
      } catch (error) {
        setMessage("A apărut o eroare la crearea contului.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-creare-cont">
        <div className="rectangle-37"></div>
        <div className="title-create-account">MEN CLASS</div>
        <button className="close-modal" onClick={onClose}>
          &times;
        </button>
        <div className="form-container">
          <form onSubmit={handleSubmit} noValidate>
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
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Introduceți emailul dumneavoastră"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <div className="error">{errors.email}</div>}
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
            <div className="input-group">
              <label htmlFor="password">Parolă</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Introduceți o parolă"
                value={formData.password}
                onChange={handleInputChange}
              />
              <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
              {errors.password && (
                <div className="error">{errors.password}</div>
              )}
            </div>
            <div className="input-group">
              <label htmlFor="passwordConfirmed">Confirmă parola</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="passwordConfirmed"
                name="passwordConfirmed"
                placeholder="Confirmați parola"
                value={formData.passwordConfirmed}
                onChange={handleInputChange}
              />
              <button type="button" className="toggle-password" onClick={toggleConfirmPasswordVisibility}>
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </button>
              {errors.passwordConfirmed && (
                <div className="error">{errors.passwordConfirmed}</div>
              )}
            </div>
            {message && <div className="message">{message}</div>}
            <button type="submit" className="creare-cont-button">
              Creează cont
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreareContModal;
