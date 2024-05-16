import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import io from "socket.io-client";
import fireIcon from "./fire.png"; // Import the image file using the correct path

const socket = io("http://localhost:5001");

const MapWithRoute = () => {
  const [endPoint, setEndpoint] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    socket.on("coordinates", (data) => {
      setEndpoint(data);
    });

    socket.on("image", (data) => {
      const blob = new Blob([data], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    });
  }, []);

  const customIcon = new Icon({
    iconUrl: fireIcon,
    iconSize: [30, 30],
  });

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={endPoint ? endPoint : [33.98460250512071, -5.019231838515444]}
        zoom={15}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {endPoint && (
          <Marker position={endPoint} icon={customIcon}>
            <Popup>
              {imageUrl ? (
                <img src={imageUrl} alt="Fire" style={{ width: "200px" }} />
              ) : (
                "Fire detected"
              )}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapWithRoute;
