import React, { useEffect } from "react";

interface Props {
  jwt: string;
  username: string;
  trip: Trip;
}

function RateTripComponent(props: Props) {
  const { jwt, username, trip } = { ...props };

  useEffect(() => {
    console.log(username);
  }, [props]);
  return <>yo!</>;
}

export default RateTripComponent;
