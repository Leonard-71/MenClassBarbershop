import React from 'react';
import './CardAngajatPar.scss';

const CardAngajatPar = ({
  nume,
  prenume,
  functie,
  descriere,
  logoTelefon,
  numarTelefon,
  logoInstagram,
  linkInstagram,
  logoFacebook,
  linkFacebook,
  poza,
}) => {

  const handleFacebookClick = () => {
    window.open(linkFacebook, "_blank");
  };

  const handleInstagramClick = () => {
    window.open(linkInstagram, "_blank");
  };

  return (
    <div className='card-angajat-par'>
      <div className='card-content-angajat-par'>
        <div className='coloana-stanga-angajat-par'>
          <div className="img-angajat-par">
            <img src={poza} alt={`${nume} ${prenume}`} className='imagine-angajat-par' />
          </div>
        </div>
        <div className="coloana-dreapta-angajat-par">
          <div className="nume-prenume-angajat-par">
            <p>
              {nume} {prenume}
            </p>
          </div>
          <div className="descriere-angajat-par">
            <h3>{functie}</h3>
            <p>{descriere}</p>
            <div className="contact-angajat-par">
              <div className="icon-angajat-par">
                <img src={logoTelefon} alt="Icon Telefon" />
                <p>{numarTelefon}</p>
              </div>
              <div className="icon-angajat-par" onClick={handleInstagramClick}>
                <img src={logoInstagram} alt="Icon Instagram" />
              </div>
              <div className="icon-angajat-par" onClick={handleFacebookClick}>
                <img src={logoFacebook} alt="Icon Facebook" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardAngajatPar;
