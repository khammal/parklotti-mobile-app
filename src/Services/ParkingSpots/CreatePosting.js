import axiosI from '@/Services';
const FormData = require('form-data');

export default async (postingDetails) => {
    const apiUrl = `/parkingSpot`;

    try {
        const form = new FormData();
        
        form.append('location', JSON.stringify(postingDetails.location));
        form.append('name', postingDetails.name);
        form.append('description', postingDetails.description);
        form.append('type', postingDetails.type);
        postingDetails.images.forEach(function(img) {
            form.append('images', img);
        });

        const axiosResponse = await axiosI.post(apiUrl, form, { headers: { 'Content-Type': 'multipart/form-data' } });
        const apiResponse = axiosResponse.data;

        if (apiResponse.data) {
            return apiResponse.data;
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
