declare global {
    type User = {
        id: string,
        email: string,
        username: string,
        role: string,
    }

    type LoginInfo = {
        username: string,
        password: string,
    }

    type SignUpInfo = {
        email: string,
        username: string,
        password: string,
    }

    type Trip = {
        id: string,
        ownerUsername: string,
        name: string,
        description: string,
        rating: number,
        published: boolean,
        publishedDate: string;
        country: string;
    }

    type DateInterval = {
        id: string,
        name: string,
        budget: number,
        startDate: string,
        endDate: string,
        tripId: string,
    }

    type TimeSlot = {
        id: string,
        name: string,
        notes: string,
        startTime: string,
        endTime: string,
        lat: number,
        lng: number,
        dateIntervalId: string,
    }

    type Rating = {
        id: string,
        username: string,
        grade: number,
        comment: string,
        ratingDate: string,
    }

    type MarkerInfo = {
        position: google.maps.LatLng,
        color: string,
        text: string,
        timeslot: TimeSlot,
        selected: boolean,
    }
}

export { User, LoginInfo, SignUpInfo, Trip, DateInterval, TimeSlot, Rating, MarkerInfo }