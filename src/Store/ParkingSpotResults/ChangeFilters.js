import {createAction} from '@reduxjs/toolkit'

export default {
    initialState: {},
    action: createAction('parkingSpotResults/ChangeFilters'),
    reducers(state, {payload}) {
        state.filters = payload.filters;
    },
}
