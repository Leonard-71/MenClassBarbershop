import React from 'react';
import './Modal.scss';

const Modal = ({ children, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
