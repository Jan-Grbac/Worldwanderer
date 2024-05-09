import { useState, useRef, useEffect } from "react";
import GoogleMap, {
  LatLngBounds,
  MapContextProps,
} from "google-maps-react-markers";
import { Socket } from "socket.io-client";

interface Props {
  jwt: string;
  username: string;
  trip: Trip;
  dateIntervals: Array<DateInterval>;
  timeslots: Array<Array<TimeSlot>>;
  socket: Socket | undefined;
}

const AnyReactComponent = ({ lat, lng }: { lat: number; lng: number }) => (
  <div>{`Marker at ${lat}, ${lng}`}</div>
);

const MapComponent = (props: Props) => {
  const { jwt, username, trip, dateIntervals, timeslots, socket } = {
    ...props,
  };
  const mapRef = useRef<any>(null);
  const [service, setService] =
    useState<google.maps.places.AutocompleteService>();
  const [searchBox, setSearchBox] = useState<google.maps.places.Autocomplete>();

  const [loading, setLoading] = useState<boolean>(false);
  const input = document.getElementById("searchBox");

  useEffect(() => {
    console.log(jwt);
  }, [props]);

  const defaultProps = {
    center: {
      lat: 45.4076,
      lng: 13.9651,
    },
    zoom: 11,
  };
  const options = {
    fields: ["formatted_address", "geometry", "name"],
    strictBounds: false,
  };

  function onGoogleApiLoaded({
    map,
    maps,
  }: {
    map: MapContextProps["map"];
    maps: MapContextProps["maps"];
  }) {
    mapRef.current = map;
    setService(new google.maps.places.AutocompleteService());
    setSearchBox(
      new google.maps.places.Autocomplete(
        document.getElementById("searchBox") as HTMLInputElement
      )
    );
    searchBox?.addListener("place_changed", () => {
      const place = searchBox.getPlace();

      if (!place.geometry || !place.geometry.location) {
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(15);
      }

      console.log(place.geometry.location.lat());
      console.log(place.geometry.location.lng());
    });
    setLoading(true);
  }

  useEffect(() => {
    if (loading) {
      console.log("loaded");
    }
  }, [loading]);

  return (
    <>
      <input id="searchBox"></input>
      <div style={{ height: "100vh", width: "100vh", position: "relative" }}>
        <GoogleMap
          apiKey="AIzaSyACu8umhkkYq6tvxaHbP_Y_sAHRV9rCuMQ"
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          onChange={(map) => console.log("Map moved", map)}
          onGoogleApiLoaded={onGoogleApiLoaded}
        >
          <AnyReactComponent lat={45.4076} lng={13.9651} />
        </GoogleMap>
      </div>
    </>
  );
};

export default MapComponent;
