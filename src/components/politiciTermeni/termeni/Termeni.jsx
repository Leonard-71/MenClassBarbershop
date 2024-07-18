import React from "react";
import "./Termeni.scss";
import logoPolitici from "../../../assets/politici/politici.png";
import IntroPagini from "../../introPagini/IntroPagini";

const Termeni = () => {
  const titluPagina = "TERMENI ȘI CONDIȚII";

  return (
    <div className="pagina-termeni-conditii">
      <IntroPagini logoPagina={logoPolitici} titluPagina={titluPagina} />
      <div className="pagina-termeni">
        <h2>Termeni și Conditii</h2>
        <p>
          Acești termeni și conditii guvernează utilizarea acestui site web;
          navigând pe acest site web, acceptati acești termeni și conditii în
          întregime. Dacă nu sunteti de acord cu acești termeni și conditii sau
          cu orice parte a acestora, nu trebuie să utilizati acest site web.
        </p>
        <p>
          Folosind acest site web și acceptând acești termeni și conditii,
          sunteti de acord cu utilizarea cookie-urilor noastre în conformitate
          cu politica noastră de confidentialitate.
        </p>
        <h2>Utilizare acceptabilă</h2>
        <p>
          Nu veti utiliza acest site web în niciun fel care ar putea cauza
          daune site-ului web sau ar împiedica accesul altor persoane la acesta.
        </p>
        <h2>Restrictii</h2>
        <p>
          Nu trebuie să utilizati acest site web pentru a copia, stoca, găzdui,
          transmite, trimite, utiliza, publica sau distribui materiale care
          sunt sau nu legate de software-ul dăunător de calculator.
        </p>
        <h2>Modificări</h2>
        <p>
          Ne rezervăm dreptul de a modifica acești termeni și conditii în orice
          moment, iar utilizarea continuă a site-ului web va constitui
          acceptarea modificărilor respective.
        </p>
        <p>
          Pentru informatii detaliate privind termenii și conditiile noastre,
          vă rugăm să ne contactati.
        </p>
      </div>
    </div>
  );
};

export default Termeni;
