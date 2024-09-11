import {createAction} from '@reduxjs/toolkit'

export default {
    initialState: {},
    action: createAction('parkingSpot/ChangeParkingSpot'),
    reducers(state, {payload}) {
        state.parkingSpotId = payload.parkingSpotId;
    },
}
