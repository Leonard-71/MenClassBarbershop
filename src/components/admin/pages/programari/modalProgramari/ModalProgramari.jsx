import React from 'react';
import './ModalProgramari.scss';

const ModalProgramari = ({ children, onClose }) => {
  return (
    <div className="modal-backdrop-programari">
      <div className="modal-content-programari">
        <button className="close-button-programari" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default ModalProgramari;
