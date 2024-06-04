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

  function formatDate(date: string) {
    console.log(date);
    let year = date.substring(0, 4);
    let month = date.substring(5, 7);
    let day = date.substring(8, 10);
    console.log(year, month, day);

    let newDate = day + "/" + month + "/" + year;

    return newDate;
  }

  return (
    rating && (
      <>
        <div className="flex flex-col ml-4 mr-4 mt-4 border-black border-2 rounded-md p-2 pl-4">
          <div className="flex flex-row">
            <div className="flex-grow text-xl">{rating.username}</div>
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
          {"★".repeat(rating.grade)}
          {"☆".repeat(5 - rating.grade)}
          <br />
          {rating.comment}
          <br />
          {formatDate(rating.ratingDate)}
        </div>
      </>
    )
  );
}

export default RatingDisplayComponent;
