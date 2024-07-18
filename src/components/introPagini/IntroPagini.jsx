import React from 'react'
import './IntroPagini.scss'
const IntroPagini = ({logoPagina, titluPagina}) => {
    return (
      <div className="container-intro-pagini">
        <img src={logoPagina} alt="Imagine" className="imagine-intro-pagini" />
        <hr className="bara-orizontala-intro-pagini" />
        <p className="text-intro-pagini">{titluPagina}</p>
      </div>
    );
  }

export default IntroPagini




