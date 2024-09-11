import {createAction} from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default {
    action: createAction('localParking/add'),
    reducers(state, {payload}) {
        state.item.spots.push(payload);
        try {
            const jsonValue = JSON.stringify(state.item)
            console.log("saving spot " + jsonValue)
            AsyncStorage.setItem('@spots', jsonValue).then(() => {
                console.log("saved spot")
            }).catch(e => {
                console.error(e);
            })
        } catch (e) {
            console.error(e);
        }
    },
}
