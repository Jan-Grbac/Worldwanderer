import React, { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Libraries,
} from "@react-google-maps/api";

const libraries: Libraries = ["places"];
const mapContainerStyle = {
  width: "50vw",
  height: "50vh",
};
const center = {
  lat: 7.2905715, // default latitude
  lng: 80.6337262, // default longitude
};

const MapComponent = () => {
  const [map, setMap] = useState<google.maps.Map>();
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          center: { lat: 4.4333479181711075, lng: -75.21505129646759 },
          zoom: 10,
        })
      );
    }
  }, [map]);

  return (
    <>
      <div
        ref={ref as any}
        style={{ height: "100%", width: "700px", minHeight: "700px" }}
      ></div>
    </>
  );
};

export default MapComponent;
