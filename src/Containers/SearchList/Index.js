import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Alert, FlatList, Keyboard, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {useTheme} from '@/Theme'
import Search from "@/Services/Places/Search";
import {Surface} from "react-native-paper";
import Geolocation from 'react-native-geolocation-service';
import ChangeLocation from "@/Store/SearchParameters/ChangeLocation";

const styles = StyleSheet.create({
    surface: {
        padding: 8,
        height: 80,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        margin: 5,
    },
});

const requestLocationAccessPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {});
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return "LOCATION_GRANTED";
        } else {
            return "LOCATION_DENIED";
        }
    } catch (err) {
        return err;
    }
};

const IndexSearchListContainer = (props) => {
    const {Layout} = useTheme()
    const dispatch = useDispatch()
    const currentLocationBtn = {name: "Current location"};
    const [result, setResults] = useState([currentLocationBtn]);
    const [location, setLocation] = useState(null);

    const query = useSelector((state) => {
        return state?.searchParameters?.query ?? ""
    })

    useEffect(() => {
        //
    }, []);

    useEffect(() => {
        //
    }, [location]);

    useEffect(() => {
        getResults();
    }, [query]);

    const getResults = () => {
        if (query === "") {
            setResults([currentLocationBtn]);
            return;
        }
        Search(query).then(res => {
            setResults([
                currentLocationBtn,
                ...res.results.map((el) => {
                    return {
                        name: el.name,
                        location: {
                            latitude: el.geometry.location.lat,
                            longitude: el.geometry.location.lng,
                        }
                    }
                })
            ])
        });
    }

    const getPosition = () => {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(pos => {
                resolve(pos);
            }, err => {
                reject(err);
            }, {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000
            });
        });
    }

    const setLocationToCurrentLocation = async () => {
        let result = await requestLocationAccessPermission();

        if (result === "LOCATION_GRANTED") {
            try {
                let pos = await getPosition();
                setLocation(pos);
                return {data: pos};
            } catch (err) {
                Alert.alert("Uh Oh!", "We had troubles getting your location. Please try again later.");
                console.log(err);
                return {error: err};
            }
        } else if (result === "LOCATION_DENIED") {
            return {data: result};
        } else { //err
            Alert.alert("Uh Oh!", "Something went wrong when asking for the location permission.");
            console.log(result);
            return {error: result};
        }
    }

    const selectLocation = async (item) => {
        let loc = null;
        if (item.name === "Current location") {
            let locDetailed = await setLocationToCurrentLocation();
            if (!locDetailed.error && locDetailed.data !== "LOCATION_DENIED") {
                loc = {
                    latitude: locDetailed.data.coords.latitude,
                    longitude: locDetailed.data.coords.longitude,
                }
            }
        } else { // Set location to named location:
            loc = item.location;
            setLocation(loc);
        }

        if (loc !== null) {
            Keyboard.dismiss();
            dispatch(ChangeLocation.action({location: loc}));
            props.navigation.navigate("Parameters");
        }
    }

    const renderItem = ({item}) => {
        return (
            <TouchableOpacity onPress={() => selectLocation(item)}>
                <Surface style={styles.surface}>
                    <Text>{item.name}</Text>
                </Surface>
            </TouchableOpacity>
        )
    }

    return (
        <View style={[Layout.alignItemsStart]}>
            <FlatList
                style={[Layout.fullWidth]}
                data={result}
                renderItem={renderItem}
                keyExtractor={(_, i) => i.toString()}
                keyboardShouldPersistTaps={'handled'}
            />
        </View>
    )
}

export default IndexSearchListContainer
