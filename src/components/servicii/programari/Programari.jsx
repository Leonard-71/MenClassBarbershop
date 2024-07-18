import React from "react";
import "./Programari.scss";
import Program from "../../servicii/program/Program";
import CreazaProgramare from "./creazaProgramare/CreazaProgramare";

const Programari = () => {

  const titluProgram = "PROGRAMUL NOSTRU";
  const titluContact = "DATE DE CONTACT";
  const textTelefon = "Telefon";
  const numarTelefon = "0732836537";

  return (
    <div className="programari">
      <div className="coloana-stanga-programari">
        <Program
          title={titluProgram}
          titleContact={titluContact}
          textTelefon={textTelefon}
          numarTelefon={numarTelefon}
        />
      </div>

      <div className="coloana-dreapta-programari">
        <CreazaProgramare />
      </div>
    </div>
  );
};

export default Programari;
