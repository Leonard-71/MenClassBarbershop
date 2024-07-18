import React, { useEffect, useState } from 'react';
import './ListaServicii.scss';
import CardServiciu from '../cardServiciu/CardServiciu';
import { fetchServicii } from '../../../Service/servicii';

const ListaServicii = () => {
  const [servicii, setServicii] = useState([]);

  const unitateValuta= 'LEI';
  const unitateTimp= 'min';
 

  useEffect(() => {
    const getServicii = async () => {
      try {
        const data = await fetchServicii();
        setServicii(data);
      } catch (error) {
        console.error('Error fetching servicii:', error);
      }
    };

    getServicii();
  }, []);

  return (
    <div>
      {servicii.map((serviciu, index) => (
        <CardServiciu
          key={index} 
          denumire={serviciu.denumire}
          descriereServiciu={serviciu.descriereServiciu}
          durata={serviciu.durata}
          unitateTimp={unitateTimp}
          pret={serviciu.pret}
          unitateValuta={unitateValuta}
        />
      ))}
    </div>
  );
};

export default ListaServicii;
