import React, { useEffect, useState } from "react";
import NavbarComponent from "../components/NavbarComponent";
import { useNavigate } from "react-router-dom";

interface Props {
  jwt: string;
}

interface UserTrips {
  [username: string]: Trip[];
}

function AdminPage(props: Props) {
  const { jwt } = { ...props };

  const [loading, setLoading] = useState<boolean>(false);
  const [userTripData, setUserTripData] = useState<UserTrips>({});

  const navigate = useNavigate();

  useEffect(() => {
    getForUsernameAndTripName("", "");
  }, []);

  useEffect(() => {
    if (userTripData) {
      setLoading(true);
    }
  }, [userTripData]);

  function getForUsernameAndTripName(username: string, tripname: string) {
    console.log(username, tripname);
    const fetchData = {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        username: username,
        tripName: tripname,
      }),
    };
    fetch(`/api/admin/getUsersAndTrips`, fetchData)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data: UserTrips) => {
        setUserTripData(data);
      });
  }

  function search() {
    let usernameQuery = (
      document.getElementById("search-username-input") as HTMLInputElement
    ).value;
    let tripnameQuery = (
      document.getElementById("search-tripname-input") as HTMLInputElement
    ).value;

    getForUsernameAndTripName(usernameQuery, tripnameQuery);
  }

  return (
    loading && (
      <div className="flex flex-col">
        <NavbarComponent jwtIsValid={true} username={"admin"} />
        <div className="ml-8 mt-6">
          <h1 className="text-3xl italic">Users and their trips</h1>
          <div className="mt-2 flex flex-row gap-32">
            <p>Username</p>
            <p>Trip name</p>
          </div>
          <div className="mt-1 flex flex-row gap-2">
            <input
              id="search-username-input"
              type="text"
              className="border-2 border-black rounded-md pl-2 pr-2"
            ></input>
            <input
              id="search-tripname-input"
              type="text"
              className="border-2 border-black rounded-md pl-2 pr-2"
            ></input>
            <button
              className="border-2 border-black rounded-md pl-2 pr-2"
              onClick={search}
            >
              <i>Search...</i>
            </button>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {Object.entries(userTripData).map(([username, trips]) => (
              <div className="bg-gray-200 w-1/2 rounded-md p-2">
                <h2>{username}</h2>
                <ul className="flex flex-col ml-4 gap-2 mt-2">
                  {trips.map((trip, index) => (
                    <li
                      key={index}
                      className="flex flex-row justify-between pl-2 pr-2 bg-gray-300 rounded-md"
                    >
                      {trip.name}
                      <button
                        onClick={() =>
                          navigate(
                            trip.published
                              ? `/viewtrip/${trip.id}`
                              : `/edittrip/${trip.id}`
                          )
                        }
                      >
                        View trip
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
}

export default AdminPage;
