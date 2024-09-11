import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import changeWindowHeight from './ChangeWindowHeight'

const sliceInitialState = {};

export default buildSlice('deviceInfo', [changeWindowHeight], sliceInitialState).reducer
