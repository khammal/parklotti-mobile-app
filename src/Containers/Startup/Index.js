import React, {useEffect} from 'react'
import {View} from 'react-native'
import {useTheme} from '@/Theme'
import {useDispatch} from 'react-redux'
import InitStartup from '@/Store/Startup/Init'

import {SplashScreen} from '@/Components'

const IndexStartupContainer = () => {
    const {Layout} = useTheme()

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(InitStartup.action())
    }, [dispatch])

    return (
        <View style={[Layout.fill, Layout.colCenter]}>
            <SplashScreen/>
            {/*
      <ActivityIndicator size={'large'} style={[Gutters.largeVMargin]} />
      */}
        </View>
    )
}

export default IndexStartupContainer
