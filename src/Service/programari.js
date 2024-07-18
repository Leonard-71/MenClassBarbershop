import axios from "axios";

const API_URL_PROGRAMARI = 'http://localhost:5050/api/programari';
const API_URL_USERS = 'http://localhost:5050/admin/users';
const API_URL_SERVICII = 'http://localhost:5050/api/servicii';
const API_URL_ANGAJATI = 'http://localhost:5050/api/angajati';

export const fetchAppointments = async (token) => {
  const response = await axios.get(API_URL_PROGRAMARI, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const fetchServices = async (token) => {
  const response = await axios.get(API_URL_SERVICII, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const fetchEmployees = async (token) => {
  const response = await axios.get(API_URL_ANGAJATI, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const fetchClient = async (id, token) => {
  const response = await axios.get(`${API_URL_USERS}/id/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const deleteAppointment = async (id, token) => {
  await axios.delete(`${API_URL_PROGRAMARI}/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};
