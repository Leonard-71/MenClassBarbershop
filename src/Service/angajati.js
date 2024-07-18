import axios from 'axios';

const API_URL_ANGAJATI = 'http://localhost:5050/api/angajati';

export const fetchAngajati = async () => {
  try {
    const response = await axios.get(API_URL_ANGAJATI);
    return response.data;
  } catch (error) {
    console.error('Eroare la preluarea angajaților: ', error);
    throw error;
  }
};

export const addAngajat = async (angajat) => {
  try {
    const response = await axios.post(API_URL_ANGAJATI, angajat);
    return response.data;
  } catch (error) {
    console.error('Eroare la adăugarea angajatului:', error);
    throw error;
  }
};

export const updateAngajat = async (id, angajat) => {
  try {
    const response = await axios.put(`${API_URL_ANGAJATI}/${id}`, angajat);
    return response.data;
  } catch (error) {
    console.error('Eroare la actualizarea angajatului:', error);
    throw error;
  }
};

export const deleteAngajat = async (id) => {
  try {
    await axios.delete(`${API_URL_ANGAJATI}/${id}`);
  } catch (error) {
    console.error('Eroare la ștergerea angajatului:', error.response ? error.response.data : error.message);
    throw error;
  }
};
