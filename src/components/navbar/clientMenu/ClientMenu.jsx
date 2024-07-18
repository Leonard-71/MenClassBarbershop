import React from 'react';
import './ClientMenu.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog, faCalendarAlt, faSignOutAlt, faCogs, faSuitcase } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const ClientMenu = ({ onClose, onLogout, onEditProfile, userRole }) => {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    onClose();
    navigate('/admin');
  };

  const handleProgramariClick = () => {
    onClose();
    if (userRole === 'ROLE_ANGAJAT') {
      navigate('/ProgramariAngajati');
    } else {
      navigate('/ProgramariClienti');
    }
  };

  const handleConcediiClick = () => {
    onClose();
    navigate('/concediuAngajat'); 
  };

  const handleLogoutClick = () => {
    onLogout();
    onClose();
  };

  return (
    <div className="client-menu">
      <div className="menu-item" onClick={() => { onEditProfile(); onClose(); }}>
        <FontAwesomeIcon icon={faUserCog} />
        <span>Editează profil</span>
      </div>
      <div className="menu-item" onClick={handleProgramariClick}>
        <FontAwesomeIcon icon={faCalendarAlt} />
        <span>Programări</span>
      </div>
      {userRole === 'ROLE_ANGAJAT' && (
        <div className="menu-item" onClick={handleConcediiClick}>
          <FontAwesomeIcon icon={faSuitcase} />
          <span>Concedii</span>
        </div>
      )}
      {userRole === 'ROLE_ADMIN' && (
        <div className="menu-item" onClick={handleAdminClick}>
          <FontAwesomeIcon icon={faCogs} />
          <span>Administrează</span>
        </div>
      )}
      <div className="menu-item" onClick={handleLogoutClick}>
        <FontAwesomeIcon icon={faSignOutAlt} />
        <span>Deconectează-te</span>
      </div>
    </div>
  );
};

export default ClientMenu;
