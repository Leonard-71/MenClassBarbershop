import React from 'react'
import './Galerie.scss';
import IntroPagini from '../introPagini/IntroPagini';
import GalerieImagini from './galerieImagini/GalerieImagini';
import logoGalerie from '../../assets/galerie/galerie.png'

const Galerie = () => {
  const titluPagina = "GALERIE FOTO";
  return (
    <div className='pagina-galerie'>
      <IntroPagini logoPagina={logoGalerie} titluPagina={titluPagina} />
      <GalerieImagini/>
      
    </div>
  )
}

export default Galerie
