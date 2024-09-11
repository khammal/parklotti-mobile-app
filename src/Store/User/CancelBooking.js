import {createAction} from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default {
    action: createAction('user/cancelBooking'),
    reducers(state, {payload}) {
        state.item.bookings = state.item.bookings.filter((val) => {
            return val._id !== payload;
        });
        try {
            const jsonValue = JSON.stringify(state.item)
            console.log("saving cancel " + jsonValue)
            AsyncStorage.setItem('@user_data', jsonValue).then(() => {
                console.log("saved bookings")
            }).catch(e => {
                console.error(e);
            })
        } catch (e) {
            console.error(e);
        }
    },
}
