import { createAction } from '@reduxjs/toolkit'

export default {
	initialState: {},
	action: createAction('deviceInfo/ChangeWindowHeight'),
	reducers(state, { payload }) {
		state.windowHeight = payload.height;
	},
}
