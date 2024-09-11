import 'react-native-gesture-handler'
import React from 'react'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/lib/integration/react'
import {persistor, store} from '@/Store'
import {ApplicationNavigator} from '@/Navigators'
import './Translations'
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';


const App = () => {
    return (
        <Provider store={store}
        >
            <PaperProvider
                theme={{
                    ...DefaultTheme,
                    colors: {
                        ...DefaultTheme.colors,
                        primary: "#54a3da"
                    }
                }
                }>
                {/**
                 * PersistGate delays the rendering of the app's UI until the persisted state has been retrieved
                 * and saved to redux.
                 * The `loading` prop can be `null` or any react instance to show during loading (e.g. a splash screen),
                 * for example `loading={<SplashScreen />}`.
                 * @see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
                 */}
                <PersistGate loading={null} persistor={persistor}>
                    <ApplicationNavigator/>
                </PersistGate>
            </PaperProvider>
        </Provider>
    )
}

export default App
