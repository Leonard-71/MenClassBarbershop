import React from 'react';
import './CardAngajatImpar.scss';

const CardAngajatImpar = ({
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
    <div className='card-angajat-impar'>
      <div className='card-content'>
        <div className="coloana-stanga">
          <div className="nume-prenume-angajat">
            <p>{nume} {prenume}</p>
          </div>
          <div className="descriere-angajat">
            <h3>{functie}</h3>
            <p>{descriere}</p>
            <div className="contact-angajat">
              <div className="icon-angajat-impar">
                <img src={logoTelefon} alt="Icon Telefon" />
                <p>{numarTelefon}</p>
              </div>
              <div className="icon-angajat-impar" onClick={handleInstagramClick}>
                <a href={linkInstagram} target="_blank" rel="noopener noreferrer">
                  <img src={logoInstagram} alt="Icon Instagram" />
                </a>
              </div>
              <div className="icon-angajat-impar" onClick={handleFacebookClick}>
                <a href={linkFacebook} target="_blank" rel="noopener noreferrer">
                  <img src={logoFacebook} alt="Icon Facebook" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className='coloana-dreapta'>
          <div className="img-angajat">
            <img src={poza} alt='Imagine' className='imagine-angajat' />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardAngajatImpar;
