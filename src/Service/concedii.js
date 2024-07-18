import axios from 'axios';

const API_URL_CONCEDII = "http://localhost:5050/api/concedii";
const API_URL_ANGAJATI = "http://localhost:5050/api/angajati";

const getToken = () => localStorage.getItem('token');

export const getAllConcedii = async () => {
  try {
    const response = await axios.get(API_URL_CONCEDII, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Eroare la preluarea concediilor:', error);
    throw error;
  }
};

export const getAngajatiDetails = async () => {
  try {
    const response = await axios.get(API_URL_ANGAJATI, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Eroare la preluarea detaliilor angajatului:', error);
    throw error;
  }
};

export const updateConcediuStatus = async (id, newStatus) => {
  try {
    const response = await axios.patch(`${API_URL_CONCEDII}/${id}`, { status: newStatus }, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Server response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Eroare la actualizarea statutului concediului:', error);
    throw error;
  }
};

export const getConcediiByAngajatId = async (angajatId) => {
  try {
    const response = await axios.get(`${API_URL_CONCEDII}/angajat/${angajatId}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Eroare la preluarea concediilor de către angajatID :', error);
    throw error;
  }
};

export const addConcediu = async (concediu) => {
  try {
    const response = await axios.post(API_URL_CONCEDII, concediu, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Eroare la adăugarea concediului:", error);
    throw error;
  }
};
