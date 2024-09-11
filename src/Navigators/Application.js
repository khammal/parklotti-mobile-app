import React, { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { IndexStartupContainer } from '@/Containers'
import { useDispatch, useSelector } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef } from '@/Navigators/Root'
import { SafeAreaView, View, StatusBar, Dimensions } from 'react-native'
import { useTheme } from '@/Theme'
import { AppearanceProvider } from 'react-native-appearance'
import ChangeWindowHeight from '@/Store/DeviceInfo/ChangeWindowHeight'

const Stack = createStackNavigator()

let MainNavigator

// @refresh reset
const ApplicationNavigator = () => {
    const {Layout, darkMode, NavigationTheme} = useTheme()
    const {colors} = NavigationTheme
    const [isApplicationLoaded, setIsApplicationLoaded] = useState(false)
    const applicationIsLoading = useSelector((state) => state.startup.loading);
    const dispatch = useDispatch();

    useEffect(() => {
        if (MainNavigator == null && !applicationIsLoading) {
            MainNavigator = require('@/Navigators/Main').default
            setIsApplicationLoaded(true)
        }
    }, [applicationIsLoading])

    // on destroy needed to be able to reset when app close in background (Android)
    useEffect(
        () => () => {
            setIsApplicationLoaded(false)
            MainNavigator = null
        },
        [],
    )

  return (
    <AppearanceProvider>
      <SafeAreaView style={[Layout.fill, { backgroundColor: colors.card }]}>
        {/*Get real window height because react native's height is ocasionally wrong.*/}
        <View style={{ flex: 1 }} onLayout={({ nativeEvent }) => { dispatch(ChangeWindowHeight.action({height: nativeEvent.layout.height})); }} >
          <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
            <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
            <Stack.Navigator headerMode={'none'}>
              <Stack.Screen name="Startup" component={IndexStartupContainer} />
              {isApplicationLoaded && MainNavigator != null && (
                <Stack.Screen
                  name="Main"
                  component={MainNavigator}
                  options={{
                    animationEnabled: false,
                  }}
                />
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </SafeAreaView>
    </AppearanceProvider>
  )
}

export default ApplicationNavigator
