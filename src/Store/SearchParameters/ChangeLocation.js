import {createAction} from '@reduxjs/toolkit'

export default {
    initialState: {},
    action: createAction('searchParameters/ChangeLocation'),
    reducers(state, {payload}) {
        state.location = payload.location;
    },
}
