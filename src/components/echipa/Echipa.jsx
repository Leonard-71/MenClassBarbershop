import React, { useEffect, useState } from "react";
import "./Echipa.scss";
import IntroPagini from '../introPagini/IntroPagini';
import CardAngajatImpar from "./cardAngajatImpar/CardAngajatImpar";
import CardAngajatPar from "./cardAngajatPar/CardAngajatPar";
import logoEchipa from "../../assets/echipa/mustati.png";
import logoTelefon from "../../assets/echipa/telefon.png";
import logoInstagram from "../../assets/echipa/instagram.png";
import logoFacebook from "../../assets/echipa/facebook.png";
import { fetchAngajati } from '../../Service/angajati';
import noimg from '../../assets/echipa/noimg.png';

const Echipa = () => {
  const [angajati, setAngajati] = useState([]);
  const titluPagina = "EI SUNT EXPERȚII NOȘTRII";

  useEffect(() => {
    const getAngajati = async () => {
      try {
        const data = await fetchAngajati();
        setAngajati(data);
      } catch (error) {
        console.error('Eroare la preluarea angajatului:', error);
      }
    };

    getAngajati();
  }, []);

  return (
    <div className="pagina-echipa">
      <IntroPagini logoPagina={logoEchipa} titluPagina={titluPagina} />
      <div className="container-angajati">
        {angajati.map((angajat, index) => {
          const poza = angajat.poza ? `data:image/jpeg;base64,${angajat.poza}` : noimg;
          return index % 2 === 0 ? (
            <CardAngajatImpar
              key={angajat.angajatId || index}   
              nume={angajat.nume}
              prenume={angajat.prenume}
              functie={angajat.functie}
              descriere={angajat.descriere}
              logoTelefon={logoTelefon}
              numarTelefon={angajat.telefon}
              logoInstagram={logoInstagram}
              linkInstagram={angajat.linkInstagram}
              logoFacebook={logoFacebook}
              linkFacebook={angajat.linkFacebook}
              poza={poza}
            />
          ) : (
            <CardAngajatPar
              key={angajat.angajatId || index}  
              nume={angajat.nume}
              prenume={angajat.prenume}
              functie={angajat.functie}
              descriere={angajat.descriere}
              logoTelefon={logoTelefon}
              numarTelefon={angajat.telefon}
              logoInstagram={logoInstagram}
              linkInstagram={angajat.linkInstagram}
              logoFacebook={logoFacebook}
              linkFacebook={angajat.linkFacebook}
              poza={poza}
            />
          )
        })}
      </div>
    </div>
  );
};

export default Echipa;
