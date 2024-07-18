import React from 'react';
import './ConfirmDialog.scss';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-dialog">
      <div className="confirm-dialog-content">
        <p>{message}</p>
        <div className="confirm-dialog-actions">
          <button className="confirm-button" onClick={onConfirm}>Confirmă</button>
          <button className="cancel-button" onClick={onCancel}>Anulează</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
