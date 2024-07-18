import React from "react";
import "./CardAdresa.scss";
import CustomMap from "./customMap/CustomMap ";

const CardAdresa = ({
  title,
  logoInstagram,
  descriereInstagram,
  linkInstagram,
  logoFacebook,
  descriereFacebook,
  linkFacebook,
  logoTelefon,
  descriereTelefon,
  logoLocatie,
  descriereLocatie
}) => {
  const mapCoordinates = [47.461351633713356, 26.296454661760723];

  return (
    <div className="container-card-adresa">
      <h2>{title}</h2>

      <div className="contact-adresa">
        <div className="item-adresa">
          <a href={linkInstagram}>
            <img src={logoInstagram} alt="Logo Instagram" />
            <span>{descriereInstagram}</span>
          </a>
        </div>

        <div className="item-adresa">
          <a href={linkFacebook}>
            <img src={logoFacebook} alt="Logo Facebook" />
            <span>{descriereFacebook}</span>
          </a>
        </div>

        <div className="item-adresa">
          <img src={logoTelefon} alt="Logo Telefon" />
          <span>{descriereTelefon}</span>
        </div>
      </div>

      <div className="container-harta">
        <CustomMap coordinates={mapCoordinates} />
        <div className="item-adresa">
          <img src={logoLocatie} alt="Logo locatie" />
          <span>{descriereLocatie}</span>
        </div>
      </div>
    </div>
  );
};

export default CardAdresa;
