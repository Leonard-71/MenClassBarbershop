import React, { useState, useEffect } from 'react';
import './ProgramareActuala.scss';
import { format, parseISO } from 'date-fns';

const ProgramareActuala = () => {
  const [nextAppointment, setNextAppointment] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const fetchAppointments = async (userId) => {
      try {
        const response = await fetch(`http://localhost:5050/api/programari/client/${userId}`, {});
        if (response.ok) {
          const data = await response.json();
          const upcomingAppointments = data
            .filter(appointment => new Date(appointment.dataProgramare) >= new Date())
            .sort((a, b) => new Date(a.dataProgramare) - new Date(b.dataProgramare));
          if (upcomingAppointments.length > 0) {
            const appointment = upcomingAppointments[0];
            const serviceDetails = await fetchServiceDetails(appointment.serviciuId);
            const employeeDetails = await fetchEmployeeDetails(appointment.angajatId);
            setNextAppointment({
              ...appointment,
              serviciu: serviceDetails.denumire,
              descriereServiciu: serviceDetails.descriereServiciu,
              pret: serviceDetails.pret,
              angajat: `${employeeDetails[0].nume} ${employeeDetails[0].prenume}`,
              dataProgramare: formatDate(appointment.dataProgramare),
              oraProgramare: formatTime(appointment.oraProgramare)
            });
            setTimeLeft(calculateTimeLeft(appointment));
          }
        } else {
          console.error('Eroare la obținerea programărilor utilizatorului:', response.status);
        }
      } catch (error) {
        console.error('Eroare în timpul cererii:', error);
      }
    };

    const emailFromLocalStorage = localStorage.getItem('email');

    const fetchUserData = async () => {
      try {
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

    if (emailFromLocalStorage) {
      fetchUserData();
    }
  }, []); 

  const fetchServiceDetails = async (serviciuId) => {
    try {
      const response = await fetch(`http://localhost:5050/api/servicii/${serviciuId}`, {});
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Eroare la obținerea detaliilor serviciului:', response.status);
        return { denumire: 'Lipsa', descriere: 'Lipsa', pret: 'Lipsa' };
      }
    } catch (error) {
      console.error('Eroare în timpul cererii:', error);
      return { denumire: 'Lipsa', descriere: 'Lipsa', pret: 'Lipsa' };
    }
  };

  const fetchEmployeeDetails = async (angajatId) => {
    try {
      const response = await fetch(`http://localhost:5050/api/angajati/${angajatId}`, {});
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Eroare la obținerea detaliilor angajatului:', response.status);
        return { nume: 'Lipsa', prenume: '' };
      }
    } catch (error) {
      console.error('Eroare în timpul cererii:', error);
      return { nume: 'Lipsa', prenume: '' };
    }
  };

  const formatDate = (dateString) => {
    const formattedDate = format(parseISO(dateString), 'dd/MM/yyyy');
    return formattedDate;
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    const formattedTime = date.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', hour12: false });
    return formattedTime;
  };

  const calculateTimeLeft = (appointment) => {
    if (!appointment.dataProgramare || !appointment.oraProgramare) {
      console.error("Data sau ora lipsesc");
      return {};
    }
    const [day, month, year] = appointment.dataProgramare.split('/');
    if (!day || !month || !year || isNaN(day) || isNaN(month) || isNaN(year)) {
      return {};
    }

    const formattedDate = `${year}-${month}-${day}`;
    const appointmentDateTimeString = `${formattedDate}T${appointment.oraProgramare}:00`;
    const appointmentDateTime = new Date(appointmentDateTimeString);
    if (isNaN(appointmentDateTime.getTime())) {
      console.error("Data programării nevalidă:", appointmentDateTimeString);
      return {};
    }

    const currentTime = new Date();
    const difference = appointmentDateTime - currentTime;
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        zile: Math.floor(difference / (1000 * 60 * 60 * 24)),
        ore: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minute: Math.floor((difference / 1000 / 60) % 60)
      };
    }
    return timeLeft;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (nextAppointment) {
        setTimeLeft(calculateTimeLeft(nextAppointment));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextAppointment]);

  const timerComponents = [];
  if (timeLeft.zile) {
    timerComponents.push(<span key="zile">{timeLeft.zile === 1 ? `${timeLeft.zile} zi` : `${timeLeft.zile} zile` } </span>);
  }
  if (timeLeft.ore) {
    timerComponents.push(<span key="ore">{timeLeft.ore === 1 ? `${timeLeft.ore} ora` : `${timeLeft.ore} ore` } </span>);
  }
  if (timeLeft.minute) {
    timerComponents.push(<span key="minute">{timeLeft.minute=== 1 ? `${timeLeft.minute} minut` : `${timeLeft.minute} minute` } </span>);
  }

  const textProgramareActuala = {
    programareActuala: "URMATOAREA PROGRAMARE",
    serviciu: "SERVICIU",
    pret: "PREȚ",
    angajat: "NUME FRIZER",
    data: "DATA",
    ora: "ORA",
    mesajTimer: "Te așteptăm în salonul nostru în",
    notificareAnulare: " Pentru a anula o programare contactează-ți frizerul"
  };

  return (
    <div className='container-programare-actuala'>
      <div className="header">
        {textProgramareActuala.programareActuala}
      </div>
      <div className="programare-container">
        {nextAppointment ? (
          <div className="content">
            <div className="content-header">
              <div className="column">{textProgramareActuala.serviciu}</div>
              <div className="column">{textProgramareActuala.pret}</div>
              <div className="column">{textProgramareActuala.angajat}</div>
              <div className="column">{textProgramareActuala.data}</div>
              <div className="column">{textProgramareActuala.ora}</div>
            </div>
            <div className="content-body">
              <div className="column">
                <div className="serviciu-title">{nextAppointment.serviciu}</div>
                <div className="serviciu-description">{nextAppointment.descriereServiciu}</div>
              </div>
              <div className="column">
                <div className="pret">{nextAppointment.pret}</div>
              </div>
              <div className="column">{nextAppointment.angajat}</div>
              <div className="column">{nextAppointment.dataProgramare}</div>
              <div className="column">{nextAppointment.oraProgramare}</div>
            </div>
            <div className="footer">
              <div>{textProgramareActuala.mesajTimer}</div>
              <div className="separator-timer"></div>
              <div className="timer">
                {timerComponents.length ? timerComponents : <span>Timpul a expirat!</span>}
              </div>
            </div>
          </div>
        ) : (
          <div>Nu există nicio programare viitoare.</div>
        )}
      </div>
      <div className="cancel-notice">
        {textProgramareActuala.notificareAnulare}
      </div>
    </div>
  );
}

export default ProgramareActuala;
