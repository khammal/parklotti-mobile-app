import axiosI, {handleError} from '@/Services'
import {GOOGLE_MAPS_API_KEY} from "@env";

export default async (query) => {
    if (!query) {
        return handleError({message: 'Query must not be empty'})
    }
    const response = await axiosI.get(`https://maps.googleapis.com/maps/api/place/textsearch/json`, {
        params: {
            inputtype: "textquery",
            key: GOOGLE_MAPS_API_KEY,
            input: query,
        }
    });
    return response.data;
}
