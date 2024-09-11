import AsyncStorage from '@react-native-async-storage/async-storage'
import {combineReducers} from 'redux'
import {FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE,} from 'redux-persist'
import {configureStore} from '@reduxjs/toolkit'

import deviceInfo from './DeviceInfo'
import startup from './Startup'
import user from './User'
import theme from './Theme'
import parkingSpotResults from './ParkingSpotResults'
import parkingSpot from './ParkingSpot'
import searchParameters from './SearchParameters'
import localStorageParking from './LocalStorageParking'

const reducers = combineReducers({
    deviceInfo,
    startup,
    user,
    theme,
    parkingSpotResults,
    parkingSpot,
    searchParameters,
    localStorageParking,
})

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['theme'],
}

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
        const middlewares = getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })

        if (__DEV__ && !process.env.JEST_WORKER_ID) {
            const createDebugger = require('redux-flipper').default
            middlewares.push(createDebugger())
        }

        return middlewares
    },
})

const persistor = persistStore(store)

export {store, persistor}
