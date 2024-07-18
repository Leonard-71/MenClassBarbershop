import React from 'react';
import './ContainerTitlu.scss';
import Imagine from '../../../assets/footer/barber.png'
const ContainerTitlu = () => {
    const nume = "MEN CLASS";
  return (
    <div className="container-titlu">
      <img src={Imagine} alt="Imagine" className="imagine" />
      <hr className="bara-orizontala" />
      <p className="text">{nume}</p>
    </div>
  );
}

export default ContainerTitlu;