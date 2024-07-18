import React, { useState } from "react";
import Rating from '@mui/material/Rating';
import "./CardRecenzieClient.scss";

const CardRecenzieClient = ({
  imgClient,
  numeClient,
  prenumeClient,
  textRecenzie,
  steleRecenzie,
  timestamp 
}) => {
  const [ratingValue, setRatingValue] = useState(steleRecenzie);

  const handleRatingChange = (event, newValue) => {
    setRatingValue(newValue);
  };

  return (
    <div className="container-recenzie-client">
      <div className="coloana-stanga-recenzie-despre">
        <div className="linie-client-recenzie-despre">
          <div className="imagine-client-despre">
            <img src={imgClient} alt="" />
          </div>
          <div className="nume-client-despre">
            {numeClient} {prenumeClient}
            <div className="timestamp-recenzie-despre">
          {new Date(timestamp).toLocaleString()}
        </div>
          </div>
        </div>
        <div className="linie-descriere-recenzie-despre">
          <div className="continut-descriere-recenzie-despre">{textRecenzie}</div>
        </div>
      </div>
      <div className="coloana-dreapta-recenzie-despre">
        <Rating
          name="client-rating"
          value={ratingValue}
          readOnly
          precision={0.1}
          onChange={handleRatingChange}
          className="stele-review-despre"
        />
       
      </div>
    </div>
  );
};

export default CardRecenzieClient;
