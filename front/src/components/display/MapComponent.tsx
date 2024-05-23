import { useState, useRef, useEffect } from "react";
import {
  AdvancedMarker,
  Pin,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
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
  setSelectedTimeslot: Function;
  setSuggestedAttractions: Function;
  setHotels: Function;
  map: google.maps.Map;
  setMap: Function;
}

interface MapLoaderProps {
  setMap: Function;
}

function MapLoader(props: MapLoaderProps) {
  const { setMap } = { ...props };
  const map = useMap();

  useEffect(() => {
    setMap(map);
  }, [map, setMap]);

  return null;
}

function MapComponent(props: Props) {
  const {
    jwt,
    username,
    trip,
    dateIntervals,
    timeslots,
    socket,
    selectedTimeslot,
    setSelectedTimeslot,
    setSuggestedAttractions,
    setHotels,
    map,
    setMap,
  } = {
    ...props,
  };

  const placesLib = useMapsLibrary("places");
  const geocodingLib = useMapsLibrary("geocoding");
  const routesLib = useMapsLibrary("routes");
  const coreLib = useMapsLibrary("core");

  const [service, setService] = useState<google.maps.places.PlacesService>();
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder>();
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();

  const [markers, setMarkers] = useState<Array<MarkerInfo>>([]);

  useEffect(() => {
    if (map && placesLib && geocodingLib && routesLib) {
      setService(new placesLib.PlacesService(map));
      setGeocoder(new geocodingLib.Geocoder());
      setDirectionsService(new routesLib.DirectionsService());
    }
  }, [map, placesLib, geocodingLib, routesLib]);

  useEffect(() => {
    if (map && geocoder && geocodingLib && coreLib) {
      let listener = map.addListener("click", (event: any) => {
        let lat = event.latLng?.lat();
        let lng = event.latLng?.lng();

        if (lat && lng) {
          geocoder.geocode(
            {
              location: new coreLib.LatLng(lat, lng),
            },
            (results, status) => {
              if (status === geocodingLib.GeocoderStatus.OK && results) {
                if (selectedTimeslot) {
                  let result = results[0];
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
  }, [map, geocoder, selectedTimeslot, geocodingLib, coreLib]);

  useEffect(() => {
    if (
      map &&
      dateIntervals &&
      timeslots &&
      directionsService &&
      coreLib &&
      routesLib
    ) {
      let newMarkersAll: Array<MarkerInfo> = [];
      for (let i = 0; i < dateIntervals.length; i++) {
        if (i < timeslots.length) {
          let newMarkers: Array<MarkerInfo> = [];
          for (let j = 0; j < timeslots[i].length; j++) {
            let timeslot = timeslots[i][j];
            let markerLatLng = new coreLib.LatLng(timeslot.lat, timeslot.lng);
            let markerInfo = {
              position: markerLatLng,
              color: colorDict[i],
              text: String(j + 1),
              timeslot: timeslot,
              selected: false,
            } as MarkerInfo;

            if (selectedTimeslot && timeslot.id === selectedTimeslot.id) {
              markerInfo.selected = true;
            }

            newMarkers.push(markerInfo);
          }
          newMarkersAll = newMarkersAll.concat(newMarkers);

          if (newMarkers.length > 1 && directionsService) {
            let src = newMarkers[0].position;
            let dest = newMarkers[newMarkers.length - 1].position;

            let waypoints = new Array<google.maps.DirectionsWaypoint>();
            for (let i = 1; i < newMarkers.length - 1; i++) {
              waypoints.push({
                location: newMarkers[i].position,
              });
            }

            let directionsRenderer = new routesLib.DirectionsRenderer();
            directionsRenderer.setMap(map);

            directionsService.route(
              {
                origin: src,
                destination: dest,
                waypoints: waypoints,
                provideRouteAlternatives: false,
                travelMode: routesLib.TravelMode.DRIVING,
                unitSystem: coreLib.UnitSystem.METRIC,
              },
              (result, status) => {
                if (status === routesLib.DirectionsStatus.OK) {
                  directionsRenderer.setDirections(result);
                  directionsRenderer.setOptions({
                    polylineOptions: {
                      clickable: false,
                      strokeColor: colorDict[i],
                      strokeWeight: 5,
                    },
                    suppressMarkers: true,
                  });
                }
              }
            );
          }
        }
      }
      setMarkers(newMarkersAll);
    }
  }, [
    dateIntervals,
    timeslots,
    selectedTimeslot,
    directionsService,
    map,
    coreLib,
    routesLib,
  ]);

  useEffect(() => {
    if (selectedTimeslot && service && coreLib && placesLib) {
      let placeSearchRequest = {
        location: new coreLib.LatLng(
          selectedTimeslot.lat,
          selectedTimeslot.lng
        ),
        radius: 40000,
        type: "tourist_attraction",
      };
      service?.nearbySearch(placeSearchRequest, (results, status) => {
        if (status === placesLib.PlacesServiceStatus.OK)
          if (results) {
            setSuggestedAttractions(results.slice(0, 5));
          }
      });

      placeSearchRequest = {
        location: new coreLib.LatLng(
          selectedTimeslot.lat,
          selectedTimeslot.lng
        ),
        radius: 5000,
        type: "lodging",
      };
      service?.nearbySearch(placeSearchRequest, (results, status) => {
        if (status === placesLib.PlacesServiceStatus.OK)
          if (results) {
            setHotels(results.slice(0, 5));
          }
      });
    }
  }, [
    selectedTimeslot,
    service,
    setSuggestedAttractions,
    setHotels,
    coreLib,
    placesLib,
  ]);

  return (
    <>
      <div style={{ height: "100%", width: "100%", position: "relative" }}>
        <Map
          id="map"
          mapId={"b4bd92c77fd97414"}
          controlled={false}
          defaultZoom={10}
          defaultCenter={{ lat: 45.4091, lng: 13.9636 }}
        >
          <MapLoader setMap={setMap} />
          {markers &&
            markers.map(function (marker: MarkerInfo) {
              return (
                <AdvancedMarker
                  position={marker.position}
                  clickable={true}
                  onClick={(event) => setSelectedTimeslot(marker.timeslot)}
                >
                  <Pin
                    background={marker.color}
                    borderColor={"#006425"}
                    glyphColor={"white"}
                    glyph={marker.text}
                    scale={marker.selected ? 1.25 : 1}
                  />
                </AdvancedMarker>
              );
            })}
        </Map>
      </div>
    </>
  );
}

export default MapComponent;
