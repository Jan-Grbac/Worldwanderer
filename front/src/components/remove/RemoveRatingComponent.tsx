import React from "react";

interface Props {
  jwt: string;
  rating: Rating;
  ratings: Array<Rating>;
  setRatings: Function;
  setHasAlreadyRated: Function;
}

function RemoveRatingComponent(props: Props) {
  const { jwt, rating, ratings, setRatings, setHasAlreadyRated } = { ...props };

  function deleteRating() {
    if (jwt && rating && ratings && setRatings && setHasAlreadyRated) {
      let newRatings = [...ratings];

      for (let i = 0; i < ratings.length; i++) {
        if (ratings[i].id === rating.id) {
          newRatings.splice(i, 1);
          break;
        }
      }

      const fetchData = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "DELETE",
      };
      fetch(`/api/core/rating/deleteRating/${rating.id}`, fetchData);

      setRatings(newRatings);
      setHasAlreadyRated(false);
    }
  }

  return <button onClick={deleteRating}>🗑️</button>;
}

export default RemoveRatingComponent;
