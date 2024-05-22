import { useState, useRef, useEffect } from "react";
import GoogleMap, {
  LatLngBounds,
  MapContextProps,
  MapMouseEvent,
} from "google-maps-react-markers";
import { Socket } from "socket.io-client";
import { colorDict } from "../../assets/colors/colorDictionary";

interface Props {
  jwt: string;
  username: string;
  trip: Trip;
  dateIntervals: Array<DateInterval>;
  timeslots: Array<Array<TimeSlot>>;
  socket: Socket | undefined;
  selectedTimeslot: TimeSlot;
  setSuggestedAttractions: Function;
  setHotels: Function;
}

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
    setHotels,
  } = {
    ...props,
  };

  const [service, setService] = useState<google.maps.places.PlacesService>();
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder>();
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [map, setMap] = useState<google.maps.Map>();

  const defaultProps = {
    center: {
      lat: 45.4076,
      lng: 13.9651,
    },
    zoom: 11,
    mapId: "b4bd92c77fd97414",
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
    setDirectionsService(new google.maps.DirectionsService());
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
    if (dateIntervals && timeslots && window.google) {
      for (let i = 0; i < dateIntervals.length; i++) {
        if (i < timeslots.length) {
          let markers: Array<google.maps.LatLng> = [];

          for (let j = 0; j < timeslots[i].length; j++) {
            let timeslot = timeslots[i][j];

            let markerLatLng = new google.maps.LatLng(
              timeslot.lat,
              timeslot.lng
            );

            if (selectedTimeslot && timeslot.id === selectedTimeslot.id) {
            }

            markers.push(markerLatLng);
          }

          if (markers.length >= 2 && directionsService) {
            let src = new google.maps.LatLng(markers[0]);
            let dest = new google.maps.LatLng(markers[markers.length - 1]);

            let waypoints = new Array<google.maps.DirectionsWaypoint>();
            for (let i = 1; i < markers.length - 1; i++) {
              waypoints.push({
                location: new google.maps.LatLng(markers[i]),
              });
            }

            let directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map as google.maps.Map);

            directionsService.route(
              {
                origin: src,
                destination: dest,
                waypoints: waypoints,
                provideRouteAlternatives: false,
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
              },
              (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                  console.log(result);
                  directionsRenderer.setDirections(result);
                  directionsRenderer.setOptions({
                    polylineOptions: {
                      clickable: false,
                      strokeColor: colorDict[i],
                      strokeWeight: 5,
                    },
                    markerOptions: {
                      draggable: true,
                      crossOnDrag: false,
                    },
                  });
                }
              }
            );
          }
        }
      }
    }
  }, [
    dateIntervals,
    timeslots,
    selectedTimeslot,
    directionsService,
    window.google,
  ]);

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
      service?.nearbySearch(placeSearchRequest, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK)
          if (results) {
            results.splice(5);
            setSuggestedAttractions(results);
          }
      });

      placeSearchRequest = {
        location: new google.maps.LatLng(
          selectedTimeslot.lat,
          selectedTimeslot.lng
        ),
        radius: 5000,
        type: "lodging",
      };
      service?.nearbySearch(placeSearchRequest, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK)
          if (results) {
            results.splice(5);
            setHotels(results);
          }
      });
    }
  }, [selectedTimeslot]);

  return (
    <>
      <div style={{ height: "100%", width: "100%", position: "relative" }}>
        <GoogleMap
          apiKey="AIzaSyACu8umhkkYq6tvxaHbP_Y_sAHRV9rCuMQ"
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          onChange={(map) => console.log("Map moved", map)}
          onGoogleApiLoaded={onGoogleApiLoaded}
        ></GoogleMap>
      </div>
    </>
  );
};

export default MapComponent;
