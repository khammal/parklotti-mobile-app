import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {ScrollView, Text, View,} from 'react-native'
import {useTheme} from '@/Theme'
import FetchOne from "@/Store/User/FetchOne";
import {SliderBox} from "react-native-image-slider-box";
import ParkingSpotListItem from "@/Components/ParkingSpotListItem";
import {Divider, IconButton} from "react-native-paper";
import FetchAll from "@/Store/LocalStorageParking/FetchAll";
import FetchPostings from '@/Services/User/FetchPostings';

const IndexHomeContainer = (props) => {
    const {Fonts, Layout} = useTheme()
    const dispatch = useDispatch()

    const bookings = useSelector((state) => {
        return state.user.item.bookings ?? [];
    });

    const [postings, setPostings] = useState([]);
    /*const postings = useSelector((state) => {
        return state.localStorageParking.item.spots ?? [];
    })*/

    React.useEffect(() => { //TODO: Cleaner solution perhaps?
        const unsubscribe = props.navigation.addListener('focus', () => {
            //Fetch postings stored under the guest account:
            FetchPostings("606eddd2eeb07da3daa7a4aa").then(postings => {
                setPostings(postings);
                //setApiResponded(true);
            }).catch(err => {
                //console.error(err);
                setPostings([]);
            });
        });

        return unsubscribe;
    }, [props.navigation]);

    useEffect(() => {
        dispatch(FetchOne.action());
        dispatch(FetchAll.action());
    }, []);

    return (
        <ScrollView style={[{flex: 1, backgroundColor: 'white'}]}>
            <SliderBox
                images={[require("@/Assets/Images/Parklotti-banner-1.png"), require("@/Assets/Images/Parklotti-banner-2.png")]}
                sliderBoxHeight={200}
                dotColor="#54a3da"
                inactiveDotColor="#90A4AE"
                circleLoop
                autoplay={true}
                autoplayInterval={5000}
            />

            <View style={[Layout.marginTop25, Layout.marginHorizontal25]}>
                <Text style={[Fonts.textRegular, {paddingVertical: 15, marginBottom: 15}]}>Active Reservations</Text>
                
                <View style={{paddingBottom: 30}}>
                    {bookings.length > 0 ?
                    bookings.map((result, i) => (
                        <ParkingSpotListItem key={i} data={result} navigation={props.navigation}/>
                    ))
                    :
                    <Text>None yet!</Text>}
                </View>
                <Divider />
            </View>
            <View style={[Layout.marginTop25, Layout.marginHorizontal25]}>
                <View style={[Layout.row, Layout.justifyContentBetween]}>
                    <Text style={[Fonts.textRegular, {paddingVertical: 15, marginBottom: 15}]}>Your Postings</Text>
                    <IconButton icon="plus-circle" size={30} color='#54a3da' onPress={() => {
                        props.navigation.navigate("CreatePosting")
                    }} />
                </View>

                <View style={{paddingBottom: 30}}>
                    {postings.length > 0 ?
                    postings.map((result, i) => (
                        <ParkingSpotListItem key={i} data={result} navigation={props.navigation}/>
                    ))
                    :
                    <Text>None yet!</Text>}
                </View>
            </View>


        </ScrollView>
    )
}

export default IndexHomeContainer
