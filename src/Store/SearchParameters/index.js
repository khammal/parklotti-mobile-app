import {buildSlice} from '@thecodingmachine/redux-toolkit-wrapper'
import ChangeQuery from './ChangeQuery'
import ChangeLocation from "./ChangeLocation";

export default buildSlice('searchParameters', [ChangeQuery, ChangeLocation], {
    query: "",
    location: {
        latitude: 37.78825,
        longitude: -122.4324,
    }
}).reducer
