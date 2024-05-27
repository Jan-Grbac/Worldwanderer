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

  const [rating, setRating] = useState<Rating>({
    id: "",
    username: username,
    grade: 0,
    comment: "",
    ratingDate: "",
  });

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
      if (rating.grade === 0) {
        return;
      }

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
    <div className="flex flex-col border-2 border-black rounded-md m-2">
      <div className="flex flex-row text-3xl self-center hover:cursor-pointer">
        <div onClick={() => handleInputChange("grade", 1)}>
          {rating.grade >= 1 ? "★" : "☆"}
        </div>
        <div onClick={() => handleInputChange("grade", 2)}>
          {rating.grade >= 2 ? "★" : "☆"}
        </div>
        <div onClick={() => handleInputChange("grade", 3)}>
          {rating.grade >= 3 ? "★" : "☆"}
        </div>
        <div onClick={() => handleInputChange("grade", 4)}>
          {rating.grade >= 4 ? "★" : "☆"}
        </div>
        <div onClick={() => handleInputChange("grade", 5)}>
          {rating.grade >= 5 ? "★" : "☆"}
        </div>
      </div>
      <textarea
        value={rating?.comment}
        className="pl-2 pr-2 ml-2 mr-2 bg-gray-200 rounded-md"
        rows={4}
        onChange={(event) => handleInputChange("comment", event.target.value)}
      ></textarea>
      <button
        onClick={handleRatingSubmit}
        className="confirmButton w-max self-center mt-2 mb-2"
      >
        Submit rating
      </button>
    </div>
  );
}

export default RateTripComponent;
