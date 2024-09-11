import axiosI from '@/Services'
import {store} from '@/Store'

export default async (filters) => {
    const spots = store.getState().localStorageParking.item.spots;

    //form url enpoint:
    const locationRadiusFilter = filters.filter((obj) => {
        return obj.filterType === "locationRadius"
    })[0];
    const timeSlotFilter = filters.filter((obj) => {
        return obj.filterType === "timeSlot"
    })[0];

    const queryString = `?filterType=${locationRadiusFilter.filterType}
&locationCenterLat=${locationRadiusFilter.locationCenter.lat}
&locationCenterLng=${locationRadiusFilter.locationCenter.lng}
&radiusSize=${locationRadiusFilter.radius.size}
&filterType=${timeSlotFilter.filterType}
&bookingDesiredStart=${timeSlotFilter.bookingDesiredStart}
&bookingDesiredEnd=${timeSlotFilter.bookingDesiredEnd}`;
    const apiUrl = `/parkingSpots${queryString}`;
    console.log(apiUrl);

    try {
        const axiosResponse = await axiosI.get(apiUrl);
        const apiResponse = axiosResponse.data;

        if (apiResponse.data) {
            return apiResponse.data.concat(
                //Gets local spots as well
                spots.filter(spot => {
                    let ky = 40000 / 360;
                    let kx = Math.cos(Math.PI * locationRadiusFilter.locationCenter.lat / 180.0) * ky;
                    let dx = Math.abs(locationRadiusFilter.locationCenter.lng - spot.location.lng) * kx;
                    let dy = Math.abs(locationRadiusFilter.locationCenter.lat - spot.location.lat) * ky;
                    return Math.sqrt(dx * dx + dy * dy) <= locationRadiusFilter.radius.size;
                })
            );
        } else if (apiResponse.error) {
            //TODO: Print this out to the user?
            return apiResponse.error.message;
        }
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error(error.response.data);
            console.error(error.response.status);
            console.error(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.error(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error', error.message);
        }
        console.error(error.config);

        throw error;
    }
}
