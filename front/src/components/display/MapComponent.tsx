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

interface BasicMarkerInfo {
  lat: number;
  lng: number;
  text: string;
}

const BasicMarker = ({
  lat,
  lng,
  text,
}: {
  lat: number;
  lng: number;
  text: string;
}) => <div>{`${text}`}</div>;

const MapComponent = (props: Props) => {
  const { jwt, username, trip, dateIntervals, timeslots, socket } = {
    ...props,
  };

  const [markers, setMarkers] = useState<Array<BasicMarkerInfo>>();

  useEffect(() => {
    console.log(jwt);
  }, [props]);

  const mapRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const defaultProps = {
    center: {
      lat: 45.4076,
      lng: 13.9651,
    },
    zoom: 11,
  };

  function onGoogleApiLoaded({
    map,
    maps,
  }: {
    map: MapContextProps["map"];
    maps: MapContextProps["maps"];
  }) {
    mapRef.current = map;

    setLoading(true);
  }

  useEffect(() => {
    if (loading) {
      console.log("loaded");
    }
  }, [loading]);

  useEffect(() => {
    let newMarkers = Array<BasicMarkerInfo>();
    if (dateIntervals && timeslots) {
      for (let i = 0; i < dateIntervals.length; i++) {
        for (let j = 0; j < timeslots[i].length; j++) {
          let timeslot = timeslots[i][j];

          let startDateFormatted = formatDate(dateIntervals[i].startDate);
          let endDateFormatted = formatDate(dateIntervals[i].endDate);

          let newMarker = {
            lat: timeslot.lat,
            lng: timeslot.lng,
            text:
              startDateFormatted +
              " - " +
              endDateFormatted +
              "\n" +
              timeslot.name,
          };

          newMarkers.push(newMarker);
        }
      }
    }

    setMarkers(newMarkers);
  }, [dateIntervals, timeslots]);

  function formatDate(date: string) {
    let year = date.substring(0, 4);
    let month = date.substring(5, 7);
    let day = date.substring(8, 10);

    let newDate = day + "/" + month + "/" + year;

    return newDate;
  }

  return (
    <>
      <div style={{ height: "100vh", width: "100vh", position: "relative" }}>
        <GoogleMap
          apiKey="AIzaSyACu8umhkkYq6tvxaHbP_Y_sAHRV9rCuMQ"
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          onChange={(map) => console.log("Map moved", map)}
          onGoogleApiLoaded={onGoogleApiLoaded}
        >
          {markers &&
            markers.map(function (marker: BasicMarkerInfo) {
              return (
                <BasicMarker
                  lat={marker.lat}
                  lng={marker.lng}
                  text={marker.text}
                />
              );
            })}
        </GoogleMap>
      </div>
    </>
  );
};

export default MapComponent;
