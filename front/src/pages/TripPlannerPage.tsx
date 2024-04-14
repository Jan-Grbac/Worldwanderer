import React, { useState } from "react";
import NavbarComponent from "../components/NavbarComponent";
import MapComponent from "../components/MapComponent";

interface Props {
  jwt: string;
  jwtIsValid: boolean;
  username: string;
}

function TripPlannerPage(props: Props) {
  //const { jwt, jwtIsValid, username } = { ...props };
  const [trip, setTrip] = useState();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <NavbarComponent />
      <p>Planning for trip with ID: </p>
      <MapComponent />
    </>
  );
}

export default TripPlannerPage;
