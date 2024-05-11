import { useState, useRef, useEffect } from "react";
import GoogleMap, {
  LatLngBounds,
  MapContextProps,
  MapMouseEvent,
} from "google-maps-react-markers";
import { Socket } from "socket.io-client";

interface Props {
  jwt: string;
  username: string;
  trip: Trip;
  dateIntervals: Array<DateInterval>;
  timeslots: Array<Array<TimeSlot>>;
  socket: Socket | undefined;
  selectedTimeslot: TimeSlot;
  setSuggestedAttractions: Function;
}

interface BasicMarkerInfo {
  lat: number;
  lng: number;
  text: string;
  color: string;
}

const BasicMarker = ({
  lat,
  lng,
  text,
  color,
}: {
  lat: number;
  lng: number;
  text: string;
  color: string;
}) => <div style={{ color }}>{`${text}`}</div>;

const MapComponent = (props: Props) => {
  const {
    jwt,
    username,
    trip,
    dateIntervals,
    timeslots,
    socket,
    selectedTimeslot,
    setSuggestedAttractions,
  } = {
    ...props,
  };

  const [markers, setMarkers] = useState<Array<BasicMarkerInfo>>();
  const [service, setService] = useState<google.maps.places.PlacesService>();
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder>();
  const [map, setMap] = useState<google.maps.Map>();

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
    setMap(map);
    setService(new google.maps.places.PlacesService(map));
    setGeocoder(new google.maps.Geocoder());
  }

  useEffect(() => {
    if (map && geocoder) {
      let listener = map.addListener("click", (event: MapMouseEvent) => {
        let lat = event.latLng?.lat();
        let lng = event.latLng?.lng();

        if (lat && lng) {
          geocoder.geocode(
            {
              location: new google.maps.LatLng(lat, lng),
            },
            (results, status) => {
              if (status === google.maps.GeocoderStatus.OK && results) {
                console.log(results);
                if (selectedTimeslot) {
                  let result = results[0];
                  console.log(result.formatted_address);
                  console.log(selectedTimeslot);
                  (
                    document.getElementById(
                      "searchBox-" + selectedTimeslot.dateIntervalId
                    ) as HTMLInputElement
                  ).value = result.formatted_address;
                  (
                    document.getElementById(
                      "timeslot-name-input-" + selectedTimeslot.dateIntervalId
                    ) as HTMLInputElement
                  ).value = result.formatted_address;
                  (
                    document.getElementById(
                      "timeslot-name-input-hidden-" +
                        selectedTimeslot.dateIntervalId
                    ) as HTMLInputElement
                  ).value = result.formatted_address;
                  (
                    document.getElementById(
                      "timeslot-lat-input-hidden-" +
                        selectedTimeslot.dateIntervalId
                    ) as HTMLInputElement
                  ).value = String(result.geometry.location.lat());
                  (
                    document.getElementById(
                      "timeslot-lng-input-hidden-" +
                        selectedTimeslot.dateIntervalId
                    ) as HTMLInputElement
                  ).value = String(result.geometry.location.lng());
                }
              }
            }
          );
        }
      });
      return () => {
        listener.remove();
      };
    }
  }, [map, geocoder, selectedTimeslot]);

  useEffect(() => {
    let newMarkers = new Array<BasicMarkerInfo>();
    if (dateIntervals && timeslots) {
      for (let i = 0; i < dateIntervals.length; i++) {
        if (i < timeslots.length) {
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
            } as BasicMarkerInfo;

            if (selectedTimeslot && timeslot.id === selectedTimeslot.id) {
              console.log("Selected timeslot: " + selectedTimeslot.id);
              newMarker.color = "red";
            }

            console.log(newMarker);

            newMarkers.push(newMarker);
          }
        }
      }
      setMarkers(newMarkers);
    }
  }, [dateIntervals, timeslots, selectedTimeslot]);

  useEffect(() => {
    if (selectedTimeslot) {
      let placeSearchRequest = {
        location: new google.maps.LatLng(
          selectedTimeslot.lat,
          selectedTimeslot.lng
        ),
        radius: 40000,
        type: "tourist_attraction",
      };
      console.log(selectedTimeslot);
      service?.nearbySearch(placeSearchRequest, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK)
          if (results) {
            results.splice(5);
            setSuggestedAttractions(results);
          }
      });
    }
  }, [selectedTimeslot]);

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
                  color={marker.color}
                />
              );
            })}
        </GoogleMap>
      </div>
    </>
  );
};

export default MapComponent;
