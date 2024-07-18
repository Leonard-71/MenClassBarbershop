import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ro from "date-fns/locale/ro";
import "react-datepicker/dist/react-datepicker.css";
import "./SolicitareConcediu.scss";
import { addConcediu } from "../../../Service/concedii";

registerLocale('ro', ro);
setDefaultLocale('ro');

const SolicitareConcediu = ({ angajatId, onClose, token, onConcediuAdded }) => {
  const today = new Date();
  const [tipConcediu, setTipConcediu] = useState("");
  const [dataInceput, setDataInceput] = useState(today);
  const [dataSfarsit, setDataSfarsit] = useState(today);
  const [nota, setNota] = useState("");
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tipConcediu) {
      setError("Tipul concediului este obligatoriu.");
      return;
    }

    if (!dataInceput) {
      setError("Data de început este obligatorie.");
      return;
    }

    if (!dataSfarsit) {
      setError("Data de sfârșit este obligatorie.");
      return;
    }

    if (dataSfarsit < dataInceput) {
      setError("Data de încheiere a concediului nu poate fi înainte de data de început.");
      return;
    }

    setError("");

    const newConcediu = {
      angajatId,
      dataInceput: dataInceput.toISOString().split('T')[0],
      dataSfarsit: dataSfarsit.toISOString().split('T')[0],
      tipConcediu,
      status: "În așteptare",
      motiv: nota,
      dataSolicitare: today.toISOString().split('T')[0],
    };

    try {
      await addConcediu(newConcediu, token);
      setNotification({ message: "Concediul s-a înregistrat cu succes", type: "success" });
      setTimeout(() => {
        setNotification({ message: "", type: "" });
        onConcediuAdded();  
        onClose(); 
      }, 2000);
    } catch (error) {
      console.error("Eroare la adăugarea concediului:", error);
      setNotification({ message: "Eroare la adăugarea concediului", type: "error" });
      setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 2000);
    }
  };

  return (
    <div className="container-concedii">
      <h1 className="titlu-concedii">Solicitare zile libere</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tipConcediu">Alege tipul zilei libere/concediului</label>
          <select
            id="tipConcediu"
            value={tipConcediu}
            onChange={(e) => setTipConcediu(e.target.value)}
          >
            <option value="">Selectează tipul</option>
            <option value="Concediu cu plată">Concediu cu plată</option>
            <option value="Zile libere fără plată">
              Zile libere fără plată
            </option>
            <option value="Sărbătoare națională">Sărbătoare națională</option>
            <option value="Concediu medical">Concediu medical</option>
            <option value="Zile libere pentru studii">
              Zile libere pentru studii
            </option>
            <option value="Zile libere eveniment deosebit">
              Zile libere eveniment deosebit
            </option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dataInceput">Începând cu data</label>
          <DatePicker
            selected={dataInceput}
            onChange={(date) => setDataInceput(date)}
            locale="ro"
            dateFormat="dd/MM/yyyy"
            className="custom-date-picker"
            id="dataInceput"
          />
        </div>
        <div className="form-group">
          <label htmlFor="dataSfarsit">Până la data</label>
          <DatePicker
            selected={dataSfarsit}
            onChange={(date) => setDataSfarsit(date)}
            locale="ro"
            dateFormat="dd/MM/yyyy"
            className="custom-date-picker"
            id="dataSfarsit"
          />
        </div>
        <div className="form-group">
          <label htmlFor="nota">Adaugă informații suplimentare</label>
          <textarea
            id="nota"
            rows="6"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="butoane">
          <button type="submit" className="buton-trimite">
            TRIMITE
          </button>
        </div>
      </form>
      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default SolicitareConcediu;
