import {buildSlice} from '@thecodingmachine/redux-toolkit-wrapper'
//import ParkingSpotResults from './ParkingSpotResults'
import ChangeFilters from './ChangeFilters'

// This state is common to all the "user" module, and can be modified by any "user" reducers
const sliceInitialState = {
    item: {},
}

export default buildSlice('parkingSpotResults', [ChangeFilters/*, ParkingSpotResults*/], sliceInitialState).reducer
