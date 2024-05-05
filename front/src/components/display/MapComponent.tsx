import React, { useState, useRef, useEffect } from "react";
import GoogleMap from "google-maps-react-markers";

const AnyReactComponent = ({ lat, lng }: { lat: number; lng: number }) => (
  <div>{`Marker at ${lat}, ${lng}`}</div>
);

const MapComponent = () => {
  const defaultProps = {
    center: {
      lat: 45.4076,
      lng: 13.9651,
    },
    zoom: 11,
  };

  return (
    <div style={{ height: "100vh", width: "100vh", position: "relative" }}>
      <GoogleMap
        apiKey="AIzaSyACu8umhkkYq6tvxaHbP_Y_sAHRV9rCuMQ"
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        onChange={(map) => console.log("Map moved", map)}
      >
        <AnyReactComponent lat={45.4076} lng={13.9651} />
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
