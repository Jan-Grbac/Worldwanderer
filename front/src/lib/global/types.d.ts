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
    }

    type DateInterval = {
        id: string,
        startDate: string,
        endDate: string,
    }

    type TimeSlot = {
        id: string,
        name: string,
        notes: string,
        startTime: string,
        endTime: string,
        lat: number,
        lng: number,
    }
}

export { User, LoginInfo, SignUpInfo, Trip, DateInterval, TimeSlot }