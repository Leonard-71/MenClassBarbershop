import React from "react";
import "./Servicii.scss";

import logoServicii from "../../assets/servicii/servicii.png";
import logoProgramari from "../../assets/servicii/programari.png";
import ListaServicii from "./listaServicii/ListaServicii";
import Programari from "./programari/Programari";
import IntroPagini from "../introPagini/IntroPagini";


const Servicii = () => {
  const titluPagina = "LISTĂ PREȚURI";
  const titluPaginaProgramari = "PROGRAMARE ONLINE";
  return (
    <div className="pagina-servicii">
      <IntroPagini logoPagina={logoServicii} titluPagina={titluPagina} />
      <div className="lista-servicii">
      <ListaServicii />
      </div>
      <IntroPagini logoPagina={logoProgramari} titluPagina={titluPaginaProgramari} />
      <Programari/>
    </div>
  );
};

export default Servicii;
