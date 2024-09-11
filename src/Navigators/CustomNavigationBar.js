import React, {useEffect, useRef, useState} from 'react'
import {Alert, Image, Keyboard} from 'react-native';
import {Appbar, Searchbar} from 'react-native-paper';
import ChangeQuery from "@/Store/SearchParameters/ChangeQuery";
import ChangeLocation from "@/Store/SearchParameters/ChangeLocation";
import Search from "@/Services/Places/Search";
import {useDispatch} from "react-redux";
import {useRoute} from '@react-navigation/native';
import {useTheme} from '@/Theme'

const CustomNavigationBar = ({navigation, previous}) => {
    const searchRef = useRef();
    const {Layout} = useTheme();
    const dispatch = useDispatch()
    const [query, setQuery] = useState("");
    const route = useRoute();
    const [showSearch, setShowSearch] = useState(false);
    const [showSearchIcon, setShowSearchIcon] = useState(true);

    useEffect(() => {
        if (showSearch && searchRef) {
            searchRef?.current?.focus();
        }
    }, [showSearch]);

    useEffect(() => {
        setShowSearch(route.name === "SearchList");
        setShowSearchIcon(route.name === "Home");
    }, [route]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            dispatch(ChangeQuery.action({query}));
        }, 500)

        return () => clearTimeout(timeout)
    }, [query]);

    function searchOnFirstResult(query) {
        Keyboard.dismiss();

        query = query.nativeEvent.text;

        if (query === "") {
            Alert.alert("Please Type in a Location.");
            return;
        }

        Search(query).then(res => {
            const searchResults = res.results;
            if (searchResults.length > 0) {
                const el = searchResults[0];
                dispatch(
                    ChangeLocation.action({
                        location: {latitude: el.geometry.location.lat, longitude: el.geometry.location.lng,}
                    })
                );
                navigation.navigate("Parameters");
            } else {
                Alert.alert("Unable to Find Location.")
            }
        });
    }

    return (
        <Appbar.Header style={[Layout.whiteBg, {height: 56}]}>
            {/* 56px high by default */}
            {showSearch ?
                <Searchbar
                    selectionColor={'#262161'}
                    ref={searchRef}
                    placeholder={"Search locations..."}
                    icon={"arrow-left"}
                    onIconPress={() => {
                        navigation.goBack();
                    }}
                    onChangeText={(query) => {
                        setQuery(query);
                    }}
                    onSubmitEditing={(query) => {
                        searchOnFirstResult(query);
                    }}
                />
                :

                <React.Fragment>
                    {previous ? <Appbar.BackAction onPress={navigation.goBack}/> : null}

                    {route?.params?.title === undefined &&
                        <Image source={require("@/Assets/Images/parklotti-logo.png")} style={{width: 42, height: 45, padding: 0, margin: 0 }}/>
                    }

                    <Appbar.Content color="#262161" title={route?.params?.title ?? "Parklotti"}/>

                    {showSearchIcon &&
                    <Appbar.Action color="#262161" icon="magnify" onPress={() => {
                        navigation.navigate("SearchList");
                    }}/>
                    }

                </React.Fragment>
            }
        </Appbar.Header>
    );
}

export default CustomNavigationBar;