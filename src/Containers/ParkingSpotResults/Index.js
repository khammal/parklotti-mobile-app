import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Dimensions, View} from 'react-native'
import {useTheme} from '@/Theme'
import MapView, {Marker} from 'react-native-maps'
import FetchParkingSpots from '@/Services/ParkingSpots/FetchFiltered'
import ChangeParkingSpot from "@/Store/ParkingSpot/ChangeParkingSpot";
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
import { useHeaderHeight } from '@react-navigation/stack';
import ParkingSpotListItem from "@/Components/ParkingSpotListItem";
import {ActivityIndicator, Text} from "react-native-paper";

const IndexResultsContainer = (props) => {
    const {Layout, Fonts} = useTheme()
    const dispatch = useDispatch()
    const headerHeight = useHeaderHeight();

    const [results, setResults] = useState([]);
    const [location, setLocation] = useState({lat: 0, lng: 0});
    const [radius, setRadius] = useState(null);
    const [apiResponded, setApiResponded] = useState(false)

    const filters = useSelector((state) => state.parkingSpotResults.filters);
    const realWindowHeight = useSelector((state) => state.deviceInfo.windowHeight);

    useEffect(() => {
        const locationRadiusFilter = filters.filter((obj) => {
            return obj.filterType === "locationRadius"
        })[0];
        const timeSlotFilter = filters.filter((obj) => {
            return obj.filterType === "timeSlotFilter"
        })[0];

        setLocation({
            lat: locationRadiusFilter.locationCenter.lat,
            lng: locationRadiusFilter.locationCenter.lng
        });

        setRadius(locationRadiusFilter.radius);

        FetchParkingSpots(filters).then(parkingSpots => {
            setResults(parkingSpots);
            setApiResponded(true);
        }).catch(err => {
            console.error(err);
            setResults([]);
        });
    }, [filters]);

    useEffect(() => {
        if(apiResponded) {
            if(results.length > 0) {
                props.navigation.setParams({ title: "Here's what we found" });
            } else {
                props.navigation.setParams({ title: "No Results" });
            }
        }
    }, [apiResponded]);

    function clickedParkingSpot(id) {
        dispatch(ChangeParkingSpot.action({
            parkingSpotId: id
        }));
        props.navigation.navigate("ParkingSpot");
    }

    const Foreground = () => (
        <View style={[Layout.fill]}>
            <View style={[Layout.fullWidth, Layout.typicalMap ]} >
                <MapView
                    style={[Layout.fill, Layout.selfStretch]}
                    region={{
                        latitude: location.lat,
                        longitude: location.lng,
                        latitudeDelta: ((radius?.size + 10) * 2) / 111,
                        longitudeDelta: ((radius?.size + 10) * 2) / 111
                    }}
                >
                    {
                        results.map((el, i) => {
                            return <Marker
                                key={i}
                                coordinate={{
                                    latitude: el.location.lat,
                                    longitude: el.location.lng,
                                }}
                                title={el.name}
                                onCalloutPress={() => clickedParkingSpot(el._id)}
                            />
                        })
                    }
                </MapView>
            </View>
        </View>
    )

    const ParkingSpotResults = () => (
        <>
            {results.length > 0
                ?
                <View style={{marginHorizontal: 25}}>
                    {results.map((result, i) => (
                        <ParkingSpotListItem key={i} data={result} navigation={props.navigation}/>
                    ))}
                </View>
                :
                <View style={[{ marginHorizontal: 25 }]} >
                    <Text style={[Fonts.titleSmall]}>Sorry, No Results</Text>
                    <Text style={[Fonts.textSmall]}>
                    {"\n"}
                    We could not find any spots for your search criteria. You could try :{"\n"}{"\n"}
                    {'\u2B24'}  Enlarging your search radius if you have not done so already.{"\n"}{"\n"}
                    {'\u2B24'}  Changing your desired booking time or length of booking time.
                    </Text>
                </View>
            }
        </>
    );

    const MainContent = (props) => (
        <View style={[{position: 'relative', height: '100%',  backgroundColor: 'white', top: -30, paddingTop: 15, borderTopLeftRadius: 30, borderTopRightRadius: 30, zIndex: 20}]}>
            { apiResponded ? <ParkingSpotResults /> : <ActivityIndicator size="large" color="#54a3da" /> }
        </View>
    )

    return (
        /* ParallaxScroll height calculation explained:
        realWindowHeight: Used this because a bug in react native has Dimensions.get('window').height ocassionally including the status bar height(Typically of size 24)
        headerHeight: self explanatory.
        -30: To account for the -30 top in the MainContent View
        -49: This could be -49(most devices) or -29 depending on the size of the bottom tab bar.*/
        <ParallaxScroll
          height={realWindowHeight-headerHeight+30-49}
          parallaxHeight={250}
          renderParallaxForeground={({ animatedValue }) => <Foreground animatedValue={animatedValue} />}
          parallaxForegroundScrollSpeed={2.5}
        >
            <MainContent/>
        </ParallaxScroll>
    )
}

export default IndexResultsContainer
