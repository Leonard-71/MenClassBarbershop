import axios from 'axios';

const API_URL_SERVICII = 'http://localhost:5050/api/servicii';

export const fetchServicii = async () => {
  try {
    const response = await axios.get(API_URL_SERVICII);
    return response.data;
  } catch (error) {
    console.error('Eroare la preluarea serviciilor:', error);
    throw error;
  }
};

export const addServiciu = async (serviciu, token) => {
  try {
    const response = await axios.post(API_URL_SERVICII, serviciu, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Eroare la adăugarea serviciului:', error);
    throw error;
  }
};

export const updateServiciu = async (id, serviciu, token) => {
  try {
    const response = await axios.put(`${API_URL_SERVICII}/${id}`, serviciu, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Eroare la actualizarea serviciului:', error);
    throw error;
  }
};

export const deleteServiciu = async (serviciuId, token) => {
  try {
    const response = await axios.delete(`${API_URL_SERVICII}/${serviciuId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Eroare la ștergerea serviciului: ", error);
    throw error;
  }
};
