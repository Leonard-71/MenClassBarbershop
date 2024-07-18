import React from 'react'
import "./ProgramariAngajati.scss"
import logoProgramare from "../../../assets/programari/programari.png";
import IntroPagini from '../../introPagini/IntroPagini'
import ListaProgramari from './listaProgramari/ListaProgramari';

const ProgramariAngajati = () => {

    const titluPagina = "PROGRAMĂRILE MELE";

  return (
    <div className='container-programari-angajati'>
      <IntroPagini logoPagina={logoProgramare} titluPagina={titluPagina} />
      <ListaProgramari/>
    </div>
  )
}

export default ProgramariAngajati
