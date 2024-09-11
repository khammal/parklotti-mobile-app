import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ScrollView, Text, View,} from 'react-native';
import {useTheme} from '@/Theme';
import {SliderBox} from "react-native-image-slider-box";
import {Button, Chip} from 'react-native-paper';
import axiosI from '@/Services'
import countries from "i18n-iso-countries";
import AddBooking from "@/Store/User/AddBooking";
import CancelBooking from "@/Store/User/CancelBooking";

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

const IndexParkingSpotContainer = (props) => {
    const {Fonts, Layout} = useTheme()
    const dispatch = useDispatch()

    const filters = useSelector((state) => state.parkingSpotResults.filters);
    const saveBooking = () => {
        dispatch(AddBooking.action(parkingSpotInfo));
    }
    const cancelBooking = () => {
        dispatch(CancelBooking.action(parkingSpotId));
    }

    const [btnText, setBtnText] = useState("Loading...");
    //default do nothing
    const [btnFunc, setBtnFunc] = useState(() => (() => {}));

    const bookings = useSelector((state) => {
        return state.user.item.bookings ?? [];
    });

    const localSpots = useSelector((state) => {
        return state.localStorageParking.item.spots ?? [];
    })

    const [parkingSpotInfo, setParkingSpotInfo] = useState({
        "_id": null,
        "name": null,
        "type": null,
        "location": {
            "countryRegion": null,
            "street": null,
            "apartmentUnitEtc": null,
            "city": null,
            "administrativeArea": null,
            "postcode": null,
            "lat": null,
            "lng": null
        },
        "description": null,
        "images": [],
        "flags": [],
        "owner": null,
        filters: [],
    });

    const parkingSpotId = useSelector((state) => {
        return state.parkingSpot.parkingSpotId;
    });

    useEffect(() => {
        if(parkingSpotInfo._id !== null) {
            //Get existing bookings with the same id
            let sameIDBookings = bookings.filter(booking => booking._id === parkingSpotInfo._id);

            let timeSlotFilter = {}
            //Find our desired time slot
            if(filters !== undefined) {
                for(let filter of filters) {
                    if(filter.filterType === "timeSlot") {
                        timeSlotFilter = filter;
                        break;
                    }
                }
            }
            let found = false;
            //See if we already have this spot booked for the time slot
            for(let booking of sameIDBookings) {
                for(let filter of booking?.filters ?? []) {
                    if(filter.filterType === "timeSlot" &&
                        filter.bookingDesiredStart === timeSlotFilter.bookingDesiredStart &&
                        filter.bookingDesiredEnd === timeSlotFilter.bookingDesiredEnd
                    ) {
                        setBtnText("Cancel Booking");
                        setBtnFunc(() => cancelBooking);
                        found = true;
                        break;
                    }
                }
            }
            if(!found) {
                setBtnText("Book");
                setBtnFunc(() => saveBooking);

            }
        }
    }, [parkingSpotInfo, bookings]);

    useEffect(() => {
        setBtnFunc(() => (() => {}));
        setBtnText("Loading...");
    }, [parkingSpotId])

    useEffect(() => {
        getParkingSpotInfo();
    }, [parkingSpotId]);

    useEffect(() => {
        if(parkingSpotInfo.name !== null) {
            props.navigation.setParams({ title: parkingSpotInfo.name });
        }
    }, [parkingSpotInfo]);

    async function getParkingSpotInfo() {
        try {
            const axiosResponse = await axiosI.get(`/parkingSpots/${parkingSpotId}`);
            const apiResponse = axiosResponse.data;

            if (apiResponse.data) {
                setParkingSpotInfo({...apiResponse.data, filters});
            } else if (apiResponse.error) {
                return apiResponse.error.message; //TODO: Print this out to the user?
            }
        } catch (error) {
            if (error.response) {
                console.log(error.response.data, error.response.status, error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
            console.log(error.config);

            return {error: error};
        }
    }

    return (
        <View style={[Layout.fill]}>
            <ScrollView>
                <SliderBox
                    images={parkingSpotInfo.images}
                    sliderBoxHeight={300}
                    dotColor="#54a3da"
                    inactiveDotColor="#90A4AE"
                    circleLoop
                />
                <ScrollView horizontal={true}>
                    <View style={[{flexDirection: 'row', justifyContent: 'flex-start'}, Layout.padding15]}>
                        <Chip style={{backgroundColor: "#54a3da", width: 125}}
                              icon="information">{parkingSpotInfo.type}</Chip>

                        {parkingSpotInfo.flags.map((flag, i) => {
                            return (
                                <Chip key={i} icon="flag">{flag}</Chip>
                            );
                        })}
                    </View>
                </ScrollView>

                <View style={[Layout.margin25]}>
                    <Text style={[Fonts.textSmall, {color: '#54a3da', fontWeight: 'bold'}]}>
                        {parkingSpotInfo.location.apartmentUnitEtc} {parkingSpotInfo.location.street}{'\n'}
                        {parkingSpotInfo.location.city} {parkingSpotInfo.location.administrativeArea} {parkingSpotInfo.location.postcode}{'\n'}
                        {countries.getName(parkingSpotInfo.location.countryRegion, "en", {select: "official"})}
                    </Text>
                    <Text style={[Layout.marginTop10]}>
                        {parkingSpotInfo.description}
                    </Text>
                </View>
            </ScrollView>
            <View style={[Layout.padding25, Layout.whiteBg, Layout.boxShadow]}>
                <Button color="#54a3da" mode="contained"
                        onPress={btnFunc}>{btnText}</Button>
            </View>
        </View>
    )
}

export default IndexParkingSpotContainer
