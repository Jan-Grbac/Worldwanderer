import React, { useEffect } from "react";

interface Props {
  hotel: google.maps.places.PlaceResult;
  selectedDateInterval: DateInterval;
}

function HotelDisplayComponent(props: Props) {
  const { hotel, selectedDateInterval } = { ...props };

  useEffect(() => {
    console.log(hotel);
  }, [hotel]);

  function formatDate(date: string) {
    let year = date.substring(0, 4);
    let month = date.substring(5, 7);
    let day = date.substring(8, 10);

    let newDate = year + month + day;

    return newDate;
  }

  function handleHotelClick() {
    if (window) {
      let startDate = formatDate(selectedDateInterval.startDate);
      let endDate = formatDate(selectedDateInterval.endDate);
      let url =
        "https://www.trivago.com/en-US/lm/" +
        hotel.name +
        "?search=100-1752777;dr-" +
        startDate +
        "-" +
        endDate;
      window.open(url, "_blank")?.focus();
    }
  }

  return (
    <>
      <div onClick={handleHotelClick}>
        <p>{hotel.name}</p>
        <br />
        <p>{hotel.formatted_address}</p>
      </div>
    </>
  );
}

export default HotelDisplayComponent;
