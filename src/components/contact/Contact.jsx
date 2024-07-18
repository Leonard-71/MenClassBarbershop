import React from "react";
import "./Contact.scss";
import IntroPagini from '../introPagini/IntroPagini'
import CardAdresa from "./cardAdresa/CardAdresa";
import logoContact from "../../assets/contact/contact.png";
import LogoInstagram from "../../assets/footer/logoInstagram.png";
import LogoFacebook from "../../assets/footer/logoFacebook.png";
import LogoTelefon from "../../assets/footer/logoTelefon.png";
import LogoLocatie from "../../assets/footer/logoLocatie.png";
import SectiuneRecenzie from "./sectiuneRecenzie/SectiuneRecenzie";

const Contact = () => {
  const contact = {
    titlu: "DATE DE CONTACT",
    linkInstagram: "https://www.instagram.com/menclass30/",
    descriereInstagram: "menclass30",
    descriereFacebook: "Menclass Barbershop",
    linkFacebook:"https://www.facebook.com/profile.php?id=61550678293737&mibextid=LQQJ4d&rdid=CJ321ipRfveLbIPB",
    descriereTelefon: "0732836537",
    descriereLocatie: "ADRESA",
    titluReview: "PĂREREA TA CONTEAZĂ",
    textButonReview: "Trimite",
    placeholderTextareaReview: "Lasă-ne un mesaj",
  };
  const titluPagina = 'CONTACT';

  return (
    <div className="container-contact-page">
      <IntroPagini  logoPagina={logoContact} titluPagina={titluPagina} />

      <CardAdresa
        title={contact.titlu}
        logoInstagram={LogoInstagram}
        descriereInstagram={contact.descriereInstagram}
        linkInstagram={contact.linkInstagram}
        logoFacebook={LogoFacebook}
        descriereFacebook={contact.descriereFacebook}
        linkFacebook={contact.linkFacebook}
        logoTelefon={LogoTelefon}
        descriereTelefon={contact.descriereTelefon}
        logoLocatie={LogoLocatie}
        descriereLocatie={contact.descriereLocatie}
      />

      <SectiuneRecenzie
        titlu={contact.titluReview}
        textButon={contact.textButonReview}
        placeholderTextarea={contact.placeholderTextareaReview}
      />
    </div>
  );
};

export default Contact;
