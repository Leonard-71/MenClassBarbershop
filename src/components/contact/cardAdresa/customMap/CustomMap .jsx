import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconLocatie from "../../../../assets/logo1.png";

const customIcon = new L.Icon({
  iconUrl: iconLocatie,
  iconSize: [50, 50],
});

const CustomMap = ({ coordinates }) => {
  return (
    <MapContainer center={coordinates} zoom={16} style={{ height: "450px", width: "95%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={coordinates} icon={customIcon}>
        <Popup>Men Class Barbershop</Popup>
      </Marker>
    </MapContainer>
  );
};

export default CustomMap;
