import {createAction} from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default {
    action: createAction('user/addBooking'),
    reducers(state, {payload}) {
        state.item.bookings.push(payload);
        try {
            const jsonValue = JSON.stringify(state.item)
            console.log("saving add " + jsonValue)
            AsyncStorage.setItem('@user_data', jsonValue).then(() => {
                console.log("saved booking")
            }).catch(e => {
                console.error(e);
            })
        } catch (e) {
            console.error(e);
        }
    },
}
