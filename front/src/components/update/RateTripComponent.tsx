import React, { useEffect, useState } from "react";

interface Props {
  jwt: string;
  username: string;
  trip: Trip;
  ratings: Array<Rating>;
  setRatings: Function;
  setHasAlreadyRated: Function;
}

function RateTripComponent(props: Props) {
  const { jwt, username, trip, ratings, setRatings, setHasAlreadyRated } = {
    ...props,
  };

  const [rating, setRating] = useState<Rating>();

  function handleInputChange(param: string, value: any) {
    let newRating = { ...rating } as Rating;

    if (param === "grade") {
      newRating[param] = value;
      setRating(newRating);
    }
    if (param === "comment") {
      newRating[param] = value;
      setRating(newRating);
    }
  }

  function handleRatingSubmit() {
    if (rating) {
      let newRatings = [...ratings];
      rating.username = username;

      const fetchData = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(rating),
      };
      fetch(`/api/core/rating/createRating/${trip.id}`, fetchData)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          newRatings.push(data);

          setHasAlreadyRated(true);

          setRating({} as Rating);
          setRatings(newRatings);
        });
    }
  }

  return (
    <div>
      <select
        onChange={(event) => handleInputChange("grade", event.target.value)}
        value={rating?.grade}
      >
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      <textarea
        value={rating?.comment}
        onChange={(event) => handleInputChange("comment", event.target.value)}
      ></textarea>
      <button onClick={handleRatingSubmit}>Submit rating</button>
    </div>
  );
}

export default RateTripComponent;
