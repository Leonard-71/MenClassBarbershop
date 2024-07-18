import React from 'react'
import "./ProgramariClienti.scss"
import logoProgramare from "../../../assets/programari/programari.png";
import IntroPagini from '../../introPagini/IntroPagini'
import ProgramareActuala from './programareActuala/ProgramareActuala';
import UltimeleProgramari from './ultimeleProgramari/UltimeleProgramari';


const ProgramariClienti = () => {

    const titluPagina = "PROGRAMĂRILE MELE";
  return (
    <div className='container-programari-clienti'>
      <IntroPagini logoPagina={logoProgramare} titluPagina={titluPagina} />
      <ProgramareActuala />
      <UltimeleProgramari />
    </div>
  )
}

export default ProgramariClienti
