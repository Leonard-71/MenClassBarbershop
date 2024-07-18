import axios from 'axios';

const API_URL = 'http://localhost:5050/admin'; 

export const getUtilizatori = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Eroare la preluarea utilizatorilor:', error);
    throw error;
  }
};

export const getUtilizator = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/users/${email}`);
    return response.data;
  } catch (error) {
    console.error('Eroare la preluarea utilizatorului:', error);
    throw error;
  }
};

export const deleteUtilizator = async (email) => {
  try {
    await axios.delete(`${API_URL}/users/${email}`);
  } catch (error) {
    console.error('Eroare la ștergerea utilizatorului:', error);
    throw error;
  }
};

export const updateUtilizator = async (email, user) => {
  try {
    await axios.put(`${API_URL}/users/${email}`, user);
  } catch (error) {
    console.error('Eroare la actualizarea utilizatorului:', error);
    throw error;
  }
};

export const addUtilizator = async (user) => {
  try {
    await axios.post(`${API_URL}/users`, user);
  } catch (error) {
    console.error('Eroare la adăugarea utilizatorului:', error);
    throw error;
  }
};
