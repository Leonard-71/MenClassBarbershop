import React from 'react';
import './ModalZileLibere.scss';

const ModalZileLibere = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop-zile-libere">
      <div className="modal-content-zile-libere">
        <button className="close-button-zile-libere" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default ModalZileLibere;
