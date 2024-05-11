import React, { useEffect } from "react";
import RemoveRatingComponent from "../remove/RemoveRatingComponent";

interface Props {
  jwt: string;
  username: string;
  rating: Rating;
  ratings: Array<Rating>;
  setRatings: Function;
  setHasAlreadyRated: Function;
}

function RatingDisplayComponent(props: Props) {
  const { jwt, username, rating, ratings, setRatings, setHasAlreadyRated } = {
    ...props,
  };

  return (
    rating && (
      <>
        <div className="d-flex flex-row">
          <div>
            {rating.username}
            <br />
            {rating.grade}
            <br />
            {rating.comment}
            <br />
            {rating.ratingDate}
          </div>
          {username === rating.username && (
            <RemoveRatingComponent
              jwt={jwt}
              rating={rating}
              ratings={ratings}
              setRatings={setRatings}
              setHasAlreadyRated={setHasAlreadyRated}
            />
          )}
        </div>
      </>
    )
  );
}

export default RatingDisplayComponent;
