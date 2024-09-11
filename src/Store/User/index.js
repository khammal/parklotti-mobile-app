import {buildSlice} from '@thecodingmachine/redux-toolkit-wrapper'
import FetchOne from './FetchOne'
import AddBooking from "./AddBooking";
import CancelBooking from "@/Store/User/CancelBooking";

// This state is common to all the "user" module, and can be modified by any "user" reducers
const sliceInitialState = {
    item: {bookings: []},
}

export default buildSlice('user', [FetchOne, AddBooking, CancelBooking], sliceInitialState).reducer