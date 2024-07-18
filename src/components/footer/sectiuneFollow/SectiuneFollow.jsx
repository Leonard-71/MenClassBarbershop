import React from "react";
import "./SectiuneFollow.scss";
const SectiuneFollow = ({
  title,
  logoInstagram,
  descriereInstagram,
  linkInstagram,
  logoFacebook,
  descriereFacebook,
  linkFacebook,
}) => {
  return (
    <div className="container-follow">
      <h2>{title}</h2>
      <div className="content">
        <div className="item">
          <a href={linkInstagram}>
            <img src={logoInstagram} alt="Logo Instagram" />
            <span>{descriereInstagram}</span>
          </a>
        </div>

        <div className="item">
          <a href={linkFacebook}>
            <img src={logoFacebook} alt="Logo Facebook" />
            <span>{descriereFacebook}</span>
          </a>
        </div>
        
      </div>
    </div>
  );
};

export default SectiuneFollow;
