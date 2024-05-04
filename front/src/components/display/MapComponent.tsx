import React, { useState, useRef, useEffect } from "react";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({ lat, lng }: { lat: number; lng: number }) => (
  <div>{`Marker at ${lat}, ${lng}`}</div>
);
const MapComponent = () => {
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };

  return (
    <div style={{ height: "100vh", width: "100vh", position: "relative" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyACu8umhkkYq6tvxaHbP_Y_sAHRV9rCuMQ" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        yesIWantToUseGoogleMapApiInternals
      >
        <AnyReactComponent lat={59.955413} lng={30.337844} />
      </GoogleMapReact>
    </div>
  );
};

export default MapComponent;
