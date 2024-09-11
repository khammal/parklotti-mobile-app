import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
    View,
    ActivityIndicator,
    Text,
    TouchableOpacity
} from 'react-native'
import {useTheme} from '@/Theme'
import {useTranslation} from 'react-i18next'
import ChangeTheme from '@/Store/Theme/ChangeTheme'
import {Appbar, TextInput, Button } from 'react-native-paper'

const IndexAccountContainer = (props) => {
    const {t} = useTranslation()
    const {Common, Fonts, Gutters, Layout} = useTheme()
    const dispatch = useDispatch()

    const [location, setLocation] = useState(null);

    const changeTheme = ({theme, darkMode}) => {
        dispatch(ChangeTheme.action({theme, darkMode}))
    }

    useEffect(() => {
        
    }, []);

    return (
        <View style={[{ margin: 25}]}>
            <Text></Text>
            <Text>Insert OAuth options here</Text>
            <Text></Text>
            <Text style={[Layout.textAlignCenter]}>──────── OR ────────</Text>
            <Text></Text>
            <TextInput label="Username"/>
            <Text></Text>
            <TextInput label="Password"/>
            <Text></Text>
            <Button icon="login" color="#54a3da" mode="contained" onPress={() => console.log('Pressed')}>Log In</Button>
            <Text></Text>
            <Text onPress={() => { props.navigation.navigate('CreateAccount'); } }style={[Layout.textAlignCenter, Fonts.textSmall, Fonts.link]}>Create Account</Text>
        </View>
    )
}

export default IndexAccountContainer
