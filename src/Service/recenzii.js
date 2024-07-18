import axios from 'axios';

const API_URL_RECENZII = 'http://localhost:5050/api/recenzii';
const API_URL_USERS = 'http://localhost:5050/admin/users';

export const fetchRecenzii = async () => {
  try {
    const response = await axios.get(API_URL_RECENZII);
    return response.data;
  } catch (error) {
    console.error('Eroare la preluarea recenziilor:', error);
    throw error;
  }
};

export const fetchUserByEmail = async (email) => {
  try {
    const response = await axios.get(`${API_URL_USERS}/${email}`);
    return response.data;
  } catch (error) {
    console.error('Eroare la preluarea utilizatorului prin e-mail:', error);
    throw error;
  }
};




