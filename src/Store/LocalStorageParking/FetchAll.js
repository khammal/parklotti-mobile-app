import {buildAsyncActions, buildAsyncReducers, buildAsyncState,} from '@thecodingmachine/redux-toolkit-wrapper'
import AsyncStorage from "@react-native-async-storage/async-storage";


export default {
    initialState: buildAsyncState('fetchAll'),
    action: buildAsyncActions('localParking/fetchAll', async () => {
        const defaultData = {
            spots: []
        }
        try {
            const value = await AsyncStorage.getItem('@spots');
            return value != null ? JSON.parse(value) : defaultData;
        } catch (e) {
            console.error(e);
            return defaultData;
        }
    }),
    reducers: buildAsyncReducers({
        errorKey: 'fetchAll.error', // Optionally, if you scoped variables, you can use a key with dot notation
        loadingKey: 'fetchAll.loading',
    }),
}