import React, { useState, useEffect, useCallback } from 'react';
import './UltimeleProgramari.scss';
import { format, parseISO } from 'date-fns';

const UltimeleProgramari = () => {
  const [appointments, setAppointments] = useState([]);

  const fetchServiceDetails = useCallback(async (serviciuId) => {
    try {
      const response = await fetch(`http://localhost:5050/api/servicii/${serviciuId}`, {});
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Eroare la obținerea detaliilor serviciului:', response.status);
        return { denumire: 'Lipsa', pret: 'Lipsa' }; 
      }
    } catch (error) {
      console.error('Eroare în timpul cererii:', error);
      return { denumire: 'Lipsa', pret: 'Lipsa' };  
    }
  }, []);

  const fetchEmployeeDetails = useCallback(async (angajatId) => {
    try {
      const response = await fetch(`http://localhost:5050/api/angajati/${angajatId}`, {});
      if (response.ok) {
        const data = await response.json();
        const angajatDetalii = {
          ...data,
          numeComplet: `${data[0].nume} ${data[0].prenume}`,
        };
        return angajatDetalii;
      } else {
        console.error('Eroare la obținerea detaliilor angajatului:', response.status);
        return { numeComplet: 'Lipsa' }; 
      }
    } catch (error) {
      console.error('Eroare în timpul cererii:', error);
      return { numeComplet: 'Lipsa' }; 
    }
  }, []);

  const formatDate = useCallback((dateString) => {
    return format(parseISO(dateString), 'dd/MM/yyyy');
  }, []);

  const formatTime = useCallback((timeString) => {
    const [hours, minutes, seconds] = timeString.split(':');
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    return date.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', hour12: false });
  }, []);

  const combineDateTime = useCallback((dateString, timeString) => {
    const date = parseISO(dateString);
    const [hours, minutes, seconds] = timeString.split(':');
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(parseInt(seconds, 10));
    return date;
  }, []);

  const fetchAppointments = useCallback(async (userId) => {
    try {
      const response = await fetch(`http://localhost:5050/api/programari/client/${userId}`, {});

      if (response.ok) {
        const data = await response.json();
        const detailedAppointments = await Promise.all(data.map(async (appointment) => {
          const serviceDetails = await fetchServiceDetails(appointment.serviciuId);
          const employeeDetails = await fetchEmployeeDetails(appointment.angajatId);
          return {
            ...appointment,
            serviciu: serviceDetails.denumire,
            pret: serviceDetails.pret,
            angajat: employeeDetails.numeComplet || 'Lipsă',
            dataProgramare: formatDate(appointment.dataProgramare),
            oraProgramare: formatTime(appointment.oraProgramare),
            appointmentDate: combineDateTime(appointment.dataProgramare, appointment.oraProgramare)
          };
        }));

        const now = new Date();
        const filteredAppointments = detailedAppointments.filter(appointment => {
          return appointment.appointmentDate < now;
        });

        setAppointments(filteredAppointments);
      } else {
        console.error('Eroare la obținerea programărilor utilizatorului:', response.status);
      }
    } catch (error) {
      console.error('Eroare în timpul cererii:', error);
    }
  }, [fetchServiceDetails, fetchEmployeeDetails, formatDate, formatTime, combineDateTime]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const emailFromLocalStorage = localStorage.getItem('email');
        const response = await fetch(`http://localhost:5050/admin/users/${emailFromLocalStorage}`, {});

        if (response.ok) {
          const data = await response.json();
          fetchAppointments(data.utilizatorId);
        } else {
          console.error('Eroare la obținerea datelor utilizatorului:', response.status);
        }
      } catch (error) {
        console.error('Eroare în timpul cererii:', error);
      }
    };

    fetchUserData();
  }, [fetchAppointments]);

  const textUltProg = {
    ultimeleProgratari: "ULTIMELE PROGRAMĂRI",
    serviciu: "SERVICIU",
    pret: "PREȚ",
    angajat: "NUME FRIZER",
    data: "DATA",
    ora: "ORA"
  };

  return (
    <div className="container-ultimele-programari">
      <div className="header">{textUltProg.ultimeleProgratari}</div>
      <div className="programari-container">
        <div className="content-header">
          <div className="column">{textUltProg.serviciu}</div>
          <div className="column">{textUltProg.pret}</div>
          <div className="column">{textUltProg.angajat}</div>
          <div className="column">{textUltProg.data}</div>
          <div className="column">{textUltProg.ora}</div>
        </div>
        <div className="content-body">
          {appointments.slice(0, 9).map((appointment, index) => (
            <div className="content-row" key={index}>
              <div className="column">
                <div className="serviciu-title">{appointment.serviciu}</div>
              </div>
              <div className="column">{appointment.pret}</div>
              <div className="column">{appointment.angajat}</div>
              <div className="column">{appointment.dataProgramare}</div>
              <div className="column">{appointment.oraProgramare}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UltimeleProgramari;
