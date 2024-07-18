import React from "react";
import "./ComponentaDescriere.scss";

const ComponentaDescriere = ({
  imagineContent,
  titluContent,
  descriereContent,
}) => {
  return (
    <div className="content-container">
      <div className="card-imagine-content">
        <img src={imagineContent} alt="Imagine" />
      </div>

      <div className="card-paralelogram">
        <div className="card-continut">
          <h4>{titluContent}</h4>
          <div className="continut-paragraf">
            {descriereContent.split("\n").map((paragraf, index) => (
              <p key={index}>{paragraf}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="card-triunghi"></div>
    </div>
  );
};

export default ComponentaDescriere;
