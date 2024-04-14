import React from "react";
import NavbarComponent from "../components/NavbarComponent";
import MapComponent from "../components/MapComponent";

interface Props {}

function TripPlannerPage(props: Props) {
  return (
    <>
      <NavbarComponent />
      <MapComponent />
    </>
  );
}

export default TripPlannerPage;
