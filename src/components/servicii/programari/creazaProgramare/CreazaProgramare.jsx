import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import { ro } from "date-fns/locale";
import "./CreazaProgramare.scss";
import logoBtnProgramari from "../../../../assets/servicii/btn-programari.png";
import checkedImage from "../../../../assets/servicii/check.png";

registerLocale("ro", ro);

const CreazaProgramare = () => {
  const textDropbox = {
    serviciu: "Serviciul dorit",
    frizer: "Angajat",
    data: "Data programării",
    ora: "Ora programării",
    buton: "PROGRAMEAZĂ-TE",
  };
  const gdpr = "GDPR";

  const [selectedOptions, setSelectedOptions] = useState({
    serviciu: null,
    frizer: null,
    data: null,
    ora: null,
  });

  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedBarberId, setSelectedBarberId] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [notification, setNotification] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const [userID, setuserID] = useState(null);
  const [userData, setUserData] = useState({
    nume: null,
    prenume: null,
    telefon: null,
  });
  const datePickerRef = useRef(null);
  const timePickerRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setNotification("Nu ești autentificat.");
          return;
        }

        const userDetailsResponse = await fetch("http://localhost:5050/api/loggeduser/details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!userDetailsResponse.ok) {
          throw new Error("Eroare la preluarea detaliilor utilizatorului");
        }

        const userDetails = await userDetailsResponse.json();
        setUserEmail(userDetails.email);
        setuserID(userDetails.utilizatorId);
        setUserData({
          nume: userDetails.nume,
          prenume: userDetails.prenume,
          telefon: userDetails.telefon,
        });
      } catch (error) {
        console.error("Eroare la preluarea detaliilor utilizatorului:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5050/api/servicii", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const servicesData = response.data.map((service) => ({
          value: service.serviciuId,
          label: service.denumire,
          durata: service.durata,
        }));
        setServices(servicesData);
      } catch (error) {
        console.error("Eroare la preluarea serviciilor:", error);
      }
    };

    const fetchBarbers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5050/api/angajati", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const barbersData = response.data.map((barber) => ({
          value: barber.angajatId,
          label: `${barber.nume} ${barber.prenume}`,
          email: barber.email,
        }));
        setBarbers(barbersData);
      } catch (error) {
        console.error("Eroare la preluarea angajatilor:", error);
      }
    };

    fetchUserData();
    fetchServices();
    fetchBarbers();
  }, []);

  const handleServiceChange = (selectedOption) => {
    setSelectedOptions((prevSelected) => ({
      ...prevSelected,
      serviciu: selectedOption,
    }));
    setSelectedServiceId(selectedOption ? selectedOption.value : null);
  };

  const handleBarberChange = (selectedOption) => {
    setSelectedOptions((prevSelected) => ({
      ...prevSelected,
      frizer: selectedOption,
    }));
    setSelectedBarberId(selectedOption ? selectedOption.value : null);
  };

  const handleDateChange = (date) => {
    setSelectedOptions((prevSelected) => ({
      ...prevSelected,
      data: date,
    }));
  };

  const handleTimeChange = (time) => {
    setSelectedOptions((prevSelected) => ({
      ...prevSelected,
      ora: time,
    }));
  };

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  const handleDatePickerClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setFocus();
    }
  };

  const handleTimePickerClick = () => {
    if (timePickerRef.current) {
      timePickerRef.current.setFocus();
    }
  };

  const handleProgramareClick = async () => {
    if (isChecked) {
      if (selectedOptions.data && selectedOptions.ora) {
        const selectedBarber = barbers.find((barber) => barber.value === selectedBarberId);
        if (selectedBarber && userEmail === selectedBarber.email) {
          setNotification("Nu te poți programa dacă frizerul ești chiar tu.");
          setTimeout(() => {
            setNotification("");
          }, 3000);
          return;
        }
        const dataProgramare = new Date(selectedOptions.data);
        dataProgramare.setDate(dataProgramare.getDate() + 1);
        const dataProgramareStr = dataProgramare.toISOString().split("T")[0];

        const oraProgramare = selectedOptions.ora.toTimeString().split(" ")[0];

        const payload = {
          angajatId: selectedBarberId,
          serviciuId: selectedServiceId,
          dataProgramare: dataProgramareStr,
          oraProgramare: oraProgramare,
          client_id: userID,
          nume: null,
          prenume: null,
          telefon: null,
        };

        try {
          const token = localStorage.getItem("token");

          if (!token) {
            setNotification("Autentificarea eșuată. Token lipsă.");
            setTimeout(() => {
              setNotification("");
            }, 6000);
            return;
          }

          const response = await axios.post("http://localhost:5050/api/programari", payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const validationMessage = response.data;

          if (validationMessage !== "Programarea a fost adăugată cu succes.") {
            setNotification(validationMessage);
            setTimeout(() => {
              setNotification("");
            }, 6000);
            return;
          }

          setNotification(validationMessage);

          setSelectedOptions({
            serviciu: null,
            frizer: null,
            data: null,
            ora: null,
          });
          setSelectedBarberId(null);
          setSelectedServiceId(null);
          setIsChecked(false);

          setTimeout(() => {
            setNotification("");
          }, 6000);
        } catch (error) {
          console.error("Eroare la înregistrarea programării:", error);
          setNotification("Eroare la înregistrarea programării.");
          setTimeout(() => {
            setNotification("");
          }, 6000);
        }
      } else {
        setNotification("Selectează data și o ora.");
        setTimeout(() => {
          setNotification("");
        }, 6000);
      }
    } else {
      setNotification("Trebuie să fii de acord cu termenii și condițiile.");
      setTimeout(() => {
        setNotification("");
      }, 6000);
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: "10px",
      borderRadius: "5px",
      backgroundColor: "#1a2532",
      color: "white",
      border: state.isFocused ? "2px solid #ada76c" : "2px solid #ada76c",
      boxShadow: state.isFocused ? "0 0 0 1px #ada76c" : null,
      cursor: "pointer",
      marginBottom: "4%",
      "&:hover": {
        border: "2px solid #ada76c",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#1a2532",
      color: "white",
      border: "2px solid #ada76c",
      zIndex: 9999,
      marginTop: "-25px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#0e131b" : "#1a2532",
      color: state.isSelected ? "#ada76c" : "white",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#0e131b",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "white",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "white",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  return (
    <div className="container">
      <Select
        value={selectedOptions.serviciu}
        onChange={handleServiceChange}
        options={services}
        placeholder={textDropbox.serviciu}
        styles={customStyles}
      />

      <Select
        value={selectedOptions.frizer}
        onChange={handleBarberChange}
        options={barbers}
        placeholder={textDropbox.frizer}
        styles={customStyles}
      />

      <div className="dropbox" onClick={handleDatePickerClick}>
        <DatePicker
          ref={datePickerRef}
          selected={selectedOptions.data}
          onChange={handleDateChange}
          placeholderText={textDropbox.data}
          dateFormat="dd-MM-yyyy"
          locale="ro"
          className="datepicker-input-creaza-programare"
        />
      </div>

      <div className="dropbox" onClick={handleTimePickerClick}>
        <DatePicker
          ref={timePickerRef}
          selected={selectedOptions.ora}
          onChange={handleTimeChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={10}
          timeCaption="Ora"
          dateFormat="HH:mm"
          placeholderText={textDropbox.ora}
          locale="ro"
          className="timepicker-input-creaza-programare"
        />
      </div>

      <div className="gdpr">
        <h2>{gdpr}</h2>
      </div>

      <div className="termeni-si-conditii">
        <label className="checkbox">
          <input
            id="checkbox-termeni"
            type="checkbox"
            checked={isChecked}
            onChange={toggleCheckbox}
          />
          {isChecked && <img src={checkedImage} alt="Checked" />}
        </label>
        <span>
          Sunt de acord cu prelucrarea datelor cu caracter personal, descrisă în
          <a href="/politica"> Politica de confidențialitate </a> a
          website-ului.
        </span>
      </div>

      <button className="btn-programare" onClick={handleProgramareClick}>
        <img src={logoBtnProgramari} alt="icon" className="btn-icon" />
        {textDropbox.buton}
      </button>

      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default CreazaProgramare;
