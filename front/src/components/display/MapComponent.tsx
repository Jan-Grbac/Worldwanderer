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
  setTimeslots: Function;
  socket: Socket | undefined;
  selectedTimeslot: TimeSlot;
  selectedDateInterval: DateInterval;
  setSelectedTimeslot: Function;
  setSuggestedAttractions: Function;
  setHotels: Function;
  map: google.maps.Map;
  setMap: Function;
  selectOnMap: boolean;
  setSelectOnMap: Function;
  editable: boolean;
  renderArray: Array<boolean>;
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
    setTimeslots,
    socket,
    selectedTimeslot,
    setSelectedTimeslot,
    selectedDateInterval,
    setSuggestedAttractions,
    setHotels,
    map,
    setMap,
    selectOnMap,
    setSelectOnMap,
    editable,
    renderArray,
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
  const [previousRenders, setPreviousRenders] = useState<
    Array<google.maps.DirectionsRenderer>
  >([]);

  const [center, setCenter] = useState({ lat: 45.4091, lng: 13.9636 });
  const [zoom, setZoom] = useState(10);

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
        if (!selectOnMap) {
          return;
        }

        let lat = event.latLng?.lat();
        let lng = event.latLng?.lng();

        if (lat && lng) {
          geocoder.geocode(
            {
              location: new coreLib.LatLng(lat, lng),
            },
            (results, status) => {
              if (status === geocodingLib.GeocoderStatus.OK && results) {
                if (selectedDateInterval) {
                  let result = results[0];
                  (
                    document.getElementById(
                      "searchBox-" + selectedDateInterval.id
                    ) as HTMLInputElement
                  ).value = result.formatted_address;
                  (
                    document.getElementById(
                      "timeslot-name-input-" + selectedDateInterval.id
                    ) as HTMLInputElement
                  ).value = result.formatted_address;
                  (
                    document.getElementById(
                      "timeslot-name-input-hidden-" + selectedDateInterval.id
                    ) as HTMLInputElement
                  ).value = result.formatted_address;
                  (
                    document.getElementById(
                      "timeslot-lat-input-hidden-" + selectedDateInterval.id
                    ) as HTMLInputElement
                  ).value = String(result.geometry.location.lat());
                  (
                    document.getElementById(
                      "timeslot-lng-input-hidden-" + selectedDateInterval.id
                    ) as HTMLInputElement
                  ).value = String(result.geometry.location.lng());
                }
              }
            }
          );
        }
        setSelectOnMap(false);
      });
      return () => {
        listener.remove();
      };
    }
  }, [map, geocoder, selectedTimeslot, geocodingLib, coreLib, selectOnMap]);

  useEffect(() => {
    if (
      map &&
      dateIntervals &&
      timeslots &&
      directionsService &&
      coreLib &&
      routesLib &&
      renderArray
    ) {
      let panned = false;
      for (let i in previousRenders) {
        previousRenders[i].setMap(null);
      }
      let newPreviousRenders: Array<google.maps.DirectionsRenderer> = [];

      let newMarkersAll: Array<MarkerInfo> = [];
      for (let i = 0; i < dateIntervals.length; i++) {
        if (renderArray[i] === false) continue;
        if (i < timeslots.length) {
          let newMarkers: Array<MarkerInfo> = [];
          for (let j = 0; j < timeslots[i].length; j++) {
            let timeslot = timeslots[i][j];
            if (timeslot.lat === 0 && timeslot.lng === 0) continue;
            if (!panned) {
              panned = true;
              setCenter({ lat: timeslot.lat, lng: timeslot.lng });
            }
            let markerLatLng = new coreLib.LatLng(timeslot.lat, timeslot.lng);
            let markerInfo = {
              position: markerLatLng,
              color: colorDict[i % 20],
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
            newPreviousRenders.push(directionsRenderer);

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
                    suppressBicyclingLayer: true,
                    suppressInfoWindows: true,
                    preserveViewport: true,
                  });
                }
              }
            );
          }
        }
      }
      setMarkers(newMarkersAll);
      setPreviousRenders(newPreviousRenders);
    }
  }, [
    dateIntervals,
    timeslots,
    selectedTimeslot,
    directionsService,
    map,
    coreLib,
    routesLib,
    renderArray,
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

  function updateTimeslotPosition(timeslot: TimeSlot) {
    const fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(timeslot),
    };
    fetch(`/api/core/timeslot/updateTimeslotPosition`, fetchData)
      .then((response) => {
        if (response.ok) {
          return;
        }
      })
      .then(() => {
        if (socket) {
          socket.emit("UPDATE", trip.id + ":" + username + ":UPDATED_TIMESLOT");
        }
      });
  }

  function dragEnd(timeslot: TimeSlot, latLng: google.maps.LatLng | null) {
    if (dragEnd === null) {
      return;
    }

    let newTimeslots = [...timeslots];
    let newTimeslot = { ...timeslot };

    newTimeslot.lat = latLng?.lat() as number;
    newTimeslot.lng = latLng?.lng() as number;

    for (let i = 0; i < newTimeslots.length; i++) {
      for (let j = 0; j < newTimeslots[i].length; j++) {
        if (newTimeslots[i][j].id === newTimeslot.id) {
          newTimeslots[i][j] = newTimeslot;
          break;
        }
      }
    }

    updateTimeslotPosition(newTimeslot);
    setTimeslots(newTimeslots);
  }

  const handleCenterChanged = () => {
    if (map) {
      const newCenter = map.getCenter();
      if (newCenter) {
        setCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
      }
    }
  };

  const handleZoomChanged = () => {
    if (map) {
      setZoom(map.getZoom() as number);
    }
  };

  return (
    <>
      <div
        id="map-container"
        style={{ height: "100%", width: "100%", position: "relative" }}
      >
        <Map
          id="map"
          mapId={"b4bd92c77fd97414"}
          center={center}
          zoom={zoom}
          onCenterChanged={handleCenterChanged}
          onZoomChanged={handleZoomChanged}
        >
          <MapLoader setMap={setMap} />
          {markers &&
            markers.map(function (marker: MarkerInfo) {
              return (
                <AdvancedMarker
                  position={marker.position}
                  clickable={true}
                  draggable={editable}
                  onClick={() => setSelectedTimeslot(marker.timeslot)}
                  onDragEnd={(event) => dragEnd(marker.timeslot, event.latLng)}
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
