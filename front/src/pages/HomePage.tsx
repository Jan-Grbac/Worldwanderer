import React, { useEffect, useState } from "react";
import NavbarComponent from "../components/NavbarComponent";
import TripPublicDisplayComponent from "../components/pure_display/TripPublicDisplayComponent";
import { useNavigate } from "react-router-dom";

interface Props {
  jwt: string;
  jwtIsValid: boolean;
  username: string;
}

function HomePage(props: Props) {
  const { jwt, jwtIsValid, username } = { ...props };

  const [loading, setLoading] = useState<boolean>(false);
  const [highestRatedTrips, setHighestRatedTrips] = useState<Array<Trip>>();
  const [searchResults, setSearchResults] = useState<Array<Trip>>();
  const [searchLoaded, setSearchLoaded] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/core/trip/getHighestRatedTrips`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setHighestRatedTrips(data);
      });
  }, []);

  useEffect(() => {
    const loadScript = (src: string, onLoad: () => void) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = onLoad;
      document.body.appendChild(script);
    };

    loadScript(
      "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js",
      () => {
        loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/country-select-js/2.1.1/js/countrySelect.min.js",
          () => {
            ($ as any)(document).ready(() => {
              ($("#country") as any).countrySelect();
            });
            setSearchLoaded(true);
          }
        );
      }
    );

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/country-select-js/2.1.1/css/countrySelect.min.css";
    document.head.appendChild(link);
  }, [loading]);

  useEffect(() => {
    if (jwt && username) {
      const fetchData = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
      };
      fetch(`/api/core/user/getUser/${username}`, fetchData)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            alert("Wrong username info.");
            return;
          }
        })
        .then((data) => {
          console.log(data);
          if (data.role === "ADMIN") {
            navigate("/admin");
          }
        });
    }
  }, [jwt, username]);

  useEffect(() => {
    if (highestRatedTrips && searchLoaded) {
      setLoading(true);
    }
  }, [highestRatedTrips, searchLoaded]);

  function searchTrips() {
    let query = (
      document.getElementById("trip-search-input") as HTMLInputElement
    ).value;
    let country_code = String(
      ($("#country_code") as JQuery<HTMLInputElement>).val()
    );

    const fetchData = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        query: query,
        country: country_code,
      }),
    };
    fetch(`/api/core/trip/searchTrip`, fetchData)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setSearchResults(data);
      });
  }

  return (
    loading && (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <NavbarComponent jwtIsValid={jwtIsValid} username={username} />

        <main className="flex-1 m-2 rounded-md">
          <div className="py-6">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="mb-4 text-3xl font-bold text-black">
                  Featured trips
                </h2>
                <hr className="mb-6 border-b-2 border-orange-500 mx-auto" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {highestRatedTrips?.map((trip: any) => (
                    <TripPublicDisplayComponent key={trip.id} trip={trip} />
                  ))}
                  {highestRatedTrips?.length === 0 && (
                    <p className="col-span-full text-center text-gray-500">
                      No trips found. Go make some!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <section className="py-6 bg-gray-50">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl font-bold text-black">
                Search for trips
              </h2>
              <div className="mt-4 flex justify-center">
                <input
                  id="trip-search-input"
                  type="text"
                  className="border-2 border-gray-300 rounded-l-md pl-3 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  id="country"
                  className="p-2 w-40 border-2 border-gray-300"
                />
                <input type="hidden" id="country_code" />
                <button
                  className="border-2 border-gray-300 bg-blue-500 text-white rounded-r-md pl-3 pr-3 py-2 hover:bg-blue-700"
                  onClick={searchTrips}
                >
                  Search...
                </button>
              </div>
            </div>
          </section>

          <div className="py-6">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="mb-4 text-3xl font-bold text-black">
                  Search results
                </h2>
                <hr className="mb-6 border-b-2 border-orange-500 mx-auto" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {searchResults?.map((trip: any) => (
                    <TripPublicDisplayComponent key={trip.id} trip={trip} />
                  ))}
                  {searchResults?.length === 0 && (
                    <p className="col-span-full text-center text-gray-500">
                      No trips match search criteria.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  );
}

export default HomePage;
