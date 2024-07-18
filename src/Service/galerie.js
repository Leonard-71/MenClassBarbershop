import axios from 'axios';

const API_URL_GALERIE = 'http://localhost:5050/api/galerie';

export const fetchImagini = async () => {
  try {
    const response = await axios.get(API_URL_GALERIE);
    return response.data;
  } catch (error) {
    console.error('Eroare la preluarea imaginilor:', error);
    throw error;
  }
};

export const addImagine = async (base64Image, token) => {
  try {
    const response = await axios.post(API_URL_GALERIE, { poza: base64Image }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Eroare la adăugarea imaginii:', error);
    throw error;
  }
};

export const deleteImagine = async (imageId, token) => {
  try {
    const response = await axios.delete(`${API_URL_GALERIE}/${imageId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Eroare la ștergerea imaginii:', error);
    throw error;
  }
};
