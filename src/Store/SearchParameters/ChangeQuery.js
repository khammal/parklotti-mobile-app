import {createAction} from '@reduxjs/toolkit'

export default {
    initialState: {},
    action: createAction('searchParameters/ChangeQuery'),
    reducers(state, {payload}) {
        state.query = payload.query;
    },
}
