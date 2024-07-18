import React from 'react';
import './ModalUtilizatori.scss';

const ModalUtilizatori = ({ children, onClose }) => {
  return (
    <div className="modal-backdrop-utilizatori">
      <div className="modal-content-utilizatori">
        <button className="close-button-utilizatori" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default ModalUtilizatori;
