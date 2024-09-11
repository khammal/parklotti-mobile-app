import {buildSlice} from '@thecodingmachine/redux-toolkit-wrapper'
import AddSpot from './AddSpot'
import FetchAll from "./FetchAll";

// This state is common to all the "user" module, and can be modified by any "user" reducers
const sliceInitialState = {
    item: {spots: []},
}

export default buildSlice('localParking', [FetchAll, AddSpot], sliceInitialState).reducer
