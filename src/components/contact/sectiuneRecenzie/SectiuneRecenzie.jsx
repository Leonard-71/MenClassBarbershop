import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Rating from '@mui/material/Rating';
import LogoReview from '../../../assets/contact/review.png';
import './SectiuneRecenzie.scss';

const SectiuneRecenzie = ({ titlu, textButon, placeholderTextarea }) => {
  const [rating, setRating] = useState(2.5);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setEmail(payload.sub);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Nu s-a reușit analizarea payload-ului tokenului:', error);
        setIsLoggedIn(false);
        localStorage.removeItem('token'); 
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      setError('Trebuie să fiți autentificat pentru a trimite o recenzie.');
      setRating(2.5);
      setMessage('');
      setTimeout(() => setError(''), 5000);
      return;
    }

    if (!message.trim()) {
      setError('Descrierea nu poate lipsi.');
      setTimeout(() => setError(''), 5000);
      return;
    }

    if (/^\d+$/.test(message.trim())) {
      setError('Descrierea nu poate conține doar cifre.');
      setTimeout(() => setError(''), 5000);
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const reviewData = {
        email,
        nota: rating,
        descriere: message,
      };

      await axios.post('http://localhost:5050/api/recenzii', reviewData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setError('');
      setSuccess('Recenzia a fost înregistrată cu succes.');
      setRating(2.5);
      setMessage('');
    } catch (error) {
      console.error('Eroare la trimiterea recenziei:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'A apărut o eroare la trimiterea recenziei.');
      } else {
        setError('A apărut o eroare la trimiterea recenziei.');
      }
      setTimeout(() => setError(''), 5000);
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="sct-recenzie">
      <h2>{titlu}</h2>
      <div className="rating">
        <Rating
          name="half-rating"
          value={rating}
          precision={0.1}
          onChange={handleRatingChange}
        />
      </div>
      <textarea
        id="review"
        placeholder={placeholderTextarea}
        value={message}
        onChange={handleMessageChange}
        rows={9}
        className="message-input"
      />
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <button 
        className="send-button" 
        onClick={handleSubmit}
      >
        <img src={LogoReview} alt="Review Logo" className="logo-review" />
        <span>{textButon}</span>
      </button>
    </div>
  );
};

export default SectiuneRecenzie;
