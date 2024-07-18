import React from "react";
import './SectiuneContact.scss'
const SectiuneContact = ({
  title,
  logoAdresa,
  descriereAdresa,
  logoTelefon,
  descriereTelefon,
}) => {

    const handleCall = () => {
        window.location.href = `tel:${descriereTelefon}`;
      };

  return (
    <div className="sectiune-contact">
      <h2>{title}</h2>
      <div className="info">
        <div className="item">
          <img src={logoAdresa} alt="Logo Adresa" />
          <p>{descriereAdresa}</p>
        </div>
        <div className="item" onClick={handleCall}>
          <img src={logoTelefon} alt="Logo Telefon" />
          <p>{descriereTelefon}</p>
        </div>
      </div>
    </div>
  );
};

export default SectiuneContact;
