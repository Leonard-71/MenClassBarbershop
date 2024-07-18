import React from "react";
import "./Footer.scss";
import ContainerTitlu from "./containerTitlu/ContainerTitlu";
import SectiuneFollow from "./sectiuneFollow/SectiuneFollow";
import LogoInstagram from "../../assets/footer/logoInstagram.png";
import LogoFacebook from "../../assets/footer/logoFacebook.png";
import LogoAdresa from "../../assets/footer/logoLocatie.png";
import LogoTelefon from "../../assets/footer/logoTelefon.png";
import SectiuneContact from "./sectiuneContact/SectiuneContact";
import SectiuneProgram from "../footer/sectiuneProgram/SectiuneProgram"; 

function Footer() {
  const media = {
    titlu: "URMĂREȘTE-NE",
    linkInstagram: "https://www.instagram.com/menclass30/",
    descriereInstagram: "menclass30",
    descriereFacebook: "Menclass Barbershop",
    linkFacebook: "https://www.facebook.com/profile.php?id=61550678293737&mibextid=LQQJ4d&rdid=CJ321ipRfveLbIPB",
  };

  const contact = {
    titlu: "CUM NE GĂSEȘTI?",
    adresa: "Fălticeni, Str. Nicolae Beldiceanu, nr.3",
    nrtelefon: "0732836537",
  };

  const titluProgram = "PROGRAMUL NOSTRU";

  return (
    <footer className="footer">
      <ContainerTitlu />

      <div className="container">
        <div className="row">
          <div className="col-md-4 col-sm-12">
            <SectiuneFollow
              title={media.titlu}
              logoInstagram={LogoInstagram}
              descriereInstagram={media.descriereInstagram}
              linkInstagram={media.linkInstagram}
              logoFacebook={LogoFacebook}
              descriereFacebook={media.descriereFacebook}
              linkFacebook={media.linkFacebook}
            />
          </div>

          <div className="col-md-4 col-sm-12">
            <div className="col-md-12">
              <SectiuneProgram
                title={titluProgram}
              />
            </div>
          </div>

          <div className="col-md-4 col-sm-12">
            <SectiuneContact
              title={contact.titlu}
              logoAdresa={LogoAdresa}
              descriereAdresa={contact.adresa}
              logoTelefon={LogoTelefon}
              descriereTelefon={contact.nrtelefon}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 col-sm-12">
            <a href="/politica">Politică de confidențialitate</a>
          </div>
          <div className="col-md-6 col-sm-12">
            <a href="/cookies">Politică cookies</a>
          </div>
          <div className="col-md-6 col-sm-12">
            <a href="/termeni">Termeni și condiții</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
