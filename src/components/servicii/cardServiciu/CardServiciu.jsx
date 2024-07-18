import React from "react";
import "./CardServiciu.scss";

const CardServiciu = ({
  denumire,
  descriereServiciu,
  durata,
  unitateTimp,
  pret,
  unitateValuta,
}) => {
  return (
    <div className="card-servicu">
      <div className="nume-serviciu">
        <h2>{denumire}</h2>
        <p>{descriereServiciu}</p>
      </div>
      <div className="durata-serviciu">
        <p>
          {durata} {unitateTimp}
        </p>
        <div className="linie-punctata"></div>
      </div>
      <div className="pret-serviciu">
        <p>
          {pret} {unitateValuta}
        </p>
      </div>
    </div>
  );
};

export default CardServiciu;
