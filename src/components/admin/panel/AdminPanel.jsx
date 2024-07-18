import React, { useState, useEffect } from 'react';
import './AdminPanel.scss';
import Utilizatori from '../pages/utilizatori/Ulilizatori';
import Programari from '../pages/programari/Programari';
import Servicii from '../pages/servicii/Servicii';
import Program from '../pages/program/Program';
import Galerie from '../pages/galerie/Galerie';
import Angajati from '../pages/angajati/Angajati';
import Concedii from '../pages/concedii/Concedii';
import ZileLibere from '../pages/zileLibere/ZileLibere';
import RaportProgramari from '../pages/raportProgramari/RaportProgramari';

const AdminPanel = () => {
  const [selectedOption, setSelectedOption] = useState('users');
  const [token, setToken] = useState('');

  const adminOptions = [
    { title: 'Utilizatori', key: 'users' },
    { title: 'Programări', key: 'appointments' },
    { title: 'Servicii', key: 'services' },
    { title: 'Program', key: 'schedule' },
    { title: 'Galerie', key: 'gallery' },
    { title: 'Angajați', key: 'employees' },
    { title: 'Concedii', key: 'concedii' },
    { title: 'Zile libere', key: 'zileLibere' },
    { title: 'Raport', key: 'raportProgramari' }
  ];

  const handleSelect = (key) => {
    setSelectedOption(key);
  };

  const renderContent = () => {
    switch (selectedOption) {
      case 'users':
        return <Utilizatori token={token} />;
      case 'appointments':
        return <Programari token={token} />;
      case 'services':
        return <Servicii token={token} />;
      case 'schedule':
        return <Program token={token} />;
      case 'gallery':
        return <Galerie token={token} />;
      case 'employees':
        return <Angajati token={token} />;
      case 'concedii':
        return <Concedii token={token} />;
      case 'zileLibere':
        return <ZileLibere token={token} />;
      case 'raportProgramari':
        return <RaportProgramari token={token} />;
      default:
        return <div>Selecteaza o aptiune</div>;
    }
  };
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <div className="admin-panel">
      <div className="admin-sidebar">
        {adminOptions.map(option => (
          <div
            key={option.key}
            className={`admin-option ${selectedOption === option.key ? 'selected' : ''}`}
            onClick={() => handleSelect(option.key)}
          >
            {option.title}
          </div>
        ))}
      </div>
      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPanel;
