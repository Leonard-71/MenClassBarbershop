import axios from 'axios';

const API_URL_PROGRAM_LUCRU = 'http://localhost:5050/api/programlucru';

export const fetchProgramLucru = async () => {
  try {
    const response = await axios.get(API_URL_PROGRAM_LUCRU);
    return response.data;
  } catch (error) {
    console.error('Eroare la preluarea programului de lucru:', error);
    throw error;
  }
};

export const addProgramLucru = async (program, token) => {
  try {
    const response = await axios.post(API_URL_PROGRAM_LUCRU, program, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Eroare la adăugarea zilei de lucru:', error);
    throw error;
  }
};

export const updateProgramLucru = async (id, program, token) => {
  try {
    const response = await axios.put(`${API_URL_PROGRAM_LUCRU}/${id}`, program, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Eroare la actualizarea zilei de lucru:', error);
    throw error;
  }
};

export const deleteProgramLucru = async (id, token) => {
  try {
    await axios.delete(`${API_URL_PROGRAM_LUCRU}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Eroare la ștergerea zilei de lucru:', error);
    throw error;
  }
};
