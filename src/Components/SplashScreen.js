import React from 'react'
import {ImageBackground} from 'react-native'
import {useTheme} from '@/Theme'

const SplashScreen = ({}) => {
    const {Layout, Images} = useTheme()

    return (
        <ImageBackground source={Images.splashScreen} style={Layout.fullSize}>
        </ImageBackground>
    )
}

export default SplashScreen
