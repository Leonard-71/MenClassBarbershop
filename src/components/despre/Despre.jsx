import React from "react";
import "./Despre.scss";
import IntroPagini from "../introPagini/IntroPagini";
import ComponentaDescriere from "./componentaDescriere/ComponentaDescriere";
import logoDespre from "../../assets/despre/despre.png";
import logoRecenzii from "../../assets/despre/recenzii.png";
import imagineContent from "../../assets/despre/intro.png";
import ListaRecenzii from "./listaRecenzii/ListaRecenzii";

const Despre = () => {
  const titluPagina = "POVESTEA NOASTRĂ";
  const titluContent = "MenClass Barbershop";
  const titluRecenzii = "PRIN OCHII CLIENȚILOR NOȘTRII";
  const descriereContent =
   `Barbershopul MenClass a luat naștere dintr-o pasiune profundă pentru frizerie și dorința de a crea un spațiu exclusivist unde fiecare client să se simtă cu adevărat special.

Totul a început cu mulți ani în urmă, când fondatorul nostru, Cristian, a descoperit arta tunsorii în timpul adolescenței. Fascinat de modul în care o tunsoare perfectă poate transforma încrederea și imaginea personală, Cristian a decis să își urmeze pasiunea și să o transforme într-o carieră de succes.

După ce a absolvit școala de frizerie și a acumulat experiență valoroasă în diverse saloane renumite, Cristian a hotărât să își deschidă propria frizerie. Astfel, Barbershopul MenClass și-a deschis ușile, devenind rapid cunoscut pentru serviciile de înaltă calitate și atmosfera prietenoasă și relaxantă pe care o oferim fiecărui client.

La Barbershopul MenClass, nu oferim doar tunsori - creăm experiențe. Frizeria noastră este un sanctuar dedicat bărbaților care apreciază stilul și rafinamentul. De la tunsori clasice la stiluri moderne, de la bărbierit tradițional la îngrijirea bărbii, echipa noastră de profesioniști este aici pentru a îți oferi servicii personalizate, adaptate perfect nevoilor și dorințelor tale.

Punem un accent deosebit pe detalii și utilizăm doar produse de cea mai înaltă calitate pentru a asigura satisfacția deplină a clienților noștri. Fiecare vizită la Barbershopul MenClass este o călătorie într-o lume a eleganței și a îngrijirii de top.

Te invităm să ne vizitezi și să descoperi de ce Barbershopul MenClass este locul preferat al bărbaților care doresc să arate și să se simtă impecabil. Împreună, vom continua să scriem o poveste de succes, pasiune și dedicare, redefinind standardele în frizerie. `;

  return (
    <div className="pagina-despre">
      <IntroPagini logoPagina={logoDespre} titluPagina={titluPagina} />
      <div className="componenta-descriere">
        <ComponentaDescriere
          imagineContent={imagineContent}
          titluContent={titluContent}
          descriereContent={descriereContent}
        />
      </div>
      <IntroPagini logoPagina={logoRecenzii} titluPagina={titluRecenzii} />
      <ListaRecenzii />
    </div>
  );
};

export default Despre;
