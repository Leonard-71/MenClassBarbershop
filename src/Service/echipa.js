import axios from 'axios';

const API_URL = 'http://localhost:5050/api/angajati';

export const fetchAngajati = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Eroare la preluarea angajatilor:', error);
    throw error;
  }
};
