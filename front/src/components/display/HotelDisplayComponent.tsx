import React, { useEffect } from "react";

interface Props {
  hotel: google.maps.places.PlaceResult;
  selectedDateInterval: DateInterval;
}

function HotelDisplayComponent(props: Props) {
  const { hotel, selectedDateInterval } = { ...props };

  useEffect(() => {
    if (hotel) {
      console.log(hotel);
    }
  }, [hotel]);

  function formatDate(date: string) {
    let year = date.substring(0, 4);
    let month = date.substring(5, 7);
    let day = date.substring(8, 10);

    let newDate = day + "/" + month + "/" + year;

    return newDate;
  }

  function handleHotelClick() {
    if (window) {
      let startDate = formatDate(selectedDateInterval.startDate);
      let endDate = formatDate(selectedDateInterval.endDate);
      let url = generateGoogleSearchUrl(
        hotel.name + " " + startDate + "-" + endDate + " " + hotel.vicinity
      );
      window.open(url, "_blank")?.focus();
    }
  }

  function generateGoogleSearchUrl(query: string): string {
    const baseUrl = "https://www.google.com/search?q=";
    const formattedQuery = encodeURIComponent(query);
    return `${baseUrl}${formattedQuery}`;
  }

  return (
    hotel.photos && (
      <>
        <div
          onClick={handleHotelClick}
          className="rounded-md shadow-md flex flex-col justify-between max-h-60"
        >
          <div className="mt-2 mb-2">
            <img
              className="self-center align-middle object-contain max-h-20 max-w-32 min-h-20 min-w-32"
              src={hotel.photos[0].getUrl()}
              height={150}
              width={150}
            ></img>
          </div>
          <div className="pl-2 pr-2">{hotel.name}</div>
          <div className="pl-2 pr-2">{hotel.formatted_address}</div>
          <div className="pl-2 pr-2">
            {hotel.rating}
            {hotel.rating && "⭐"}
          </div>
        </div>
      </>
    )
  );
}

export default HotelDisplayComponent;
