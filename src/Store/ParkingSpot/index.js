import {buildSlice} from '@thecodingmachine/redux-toolkit-wrapper'
//import ParkingSpotResults from './ParkingSpotResults'
import ChangeParkingSpot from './ChangeParkingSpot'

// This state is common to all the "user" module, and can be modified by any "user" reducers
const sliceInitialState = {
    item: {},
}

export default buildSlice('parkingSpot', [ChangeParkingSpot], sliceInitialState).reducer
