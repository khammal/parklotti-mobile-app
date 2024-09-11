import axios from 'axios'
//import { Config } from '@/Config'
import {PARKLOTTI_API_URL} from "@env";

const instance = axios.create({
    baseURL: PARKLOTTI_API_URL,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
    timeout: 3000,
})

export const handleError = (error) => {
    return Promise.reject(error);
};

instance.interceptors.response.use((response) => {
    return response;
}, (error) => {
    return handleError(error);
});

export default instance
