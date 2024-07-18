import React, { useState, useEffect } from 'react';
import CardRecenzieClient from '../cardRecenzieClient/CardRecenzieClient';
import { fetchRecenzii, fetchUserByEmail } from '../../../Service/recenzii';
import './ListaRecenzii.scss';
import imgClient from '../../../assets/navbar/profile.png';

const ListaRecenzii = () => {
  const [recenzii, setRecenzii] = useState([]);
  const [visibleRecenzii, setVisibleRecenzii] = useState([]);

  useEffect(() => {
    const loadRecenzii = async () => {
      try {
        const reviews = await fetchRecenzii();
        const reviewsWithUserDetails = await Promise.all(
          reviews.map(async (review) => {
            const user = await fetchUserByEmail(review.email);
            return {
              ...review,
              numeClient: user.nume,
              prenumeClient: user.prenume,
              imgClient: user.poza ? `data:image/jpeg;base64,${user.poza}` : imgClient
            };
          })
        );
        reviewsWithUserDetails.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setRecenzii(reviewsWithUserDetails);
        setVisibleRecenzii(reviewsWithUserDetails.slice(0, 6));
      } catch (error) {
        console.error('Eroare la preluarea recenziilor:', error);
      }
    };

    loadRecenzii();
  }, []);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      setVisibleRecenzii((prevVisibleRecenzii) => [
        ...prevVisibleRecenzii,
        ...recenzii.slice(prevVisibleRecenzii.length, prevVisibleRecenzii.length + 6),
      ]);
    }
  };

  return (
    <div className="sectiune-recenzii-pgdespre" onScroll={handleScroll}>
      {visibleRecenzii.map((review, index) => (
        <CardRecenzieClient
          key={index}
          imgClient={review.imgClient}
          numeClient={review.numeClient}
          prenumeClient={review.prenumeClient}
          textRecenzie={review.descriere}
          steleRecenzie={review.nota}
          timestamp={review.timestamp}  
        />
      ))}
    </div>
  );
};

export default ListaRecenzii;
