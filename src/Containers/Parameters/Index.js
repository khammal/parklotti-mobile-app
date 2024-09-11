import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {LogBox, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@/Theme'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {Button, Surface} from "react-native-paper";
import moment from "moment";
import Slider from '@react-native-community/slider';
import MapView, {Circle, Marker} from "react-native-maps";
import ChangeFilters from "@/Store/ParkingSpotResults/ChangeFilters";

const styles = StyleSheet.create({
    surface: {
        padding: 8,
        height: 30,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 1.25,
    },
});
const TYPE_START = "start";
const TYPE_END = "end";

function prettyRadius(radius) {
    if (radius < 5) {
        return Math.floor(radius);
    }
    return Math.floor(radius / 5) * 5;
}

function currentTimeCeiledTo5min() {
    const now = moment().startOf('minute');
    now.add(5 - (now.minute() % 5), "minutes");
    return now;
}

const IndexParametersContainer = (props) => {
    const {Layout} = useTheme()
    const dispatch = useDispatch()

    const [pickerVisible, setPickerVisible] = useState(false);
    const [pickerType, setPickerType] = useState("start");
    const [now, setNow] = useState(currentTimeCeiledTo5min());
    const [minDate, setMinDate] = useState(now.toDate());
    const [maxDate, setMaxDate] = useState(moment(now).add(6, 'months').toDate());
    const [bookingStartTime, setBookingStartTime] = useState(now);
    const [bookingEndTime, setBookingEndTime] = useState(moment(now).add(2, 'hours'));
    const [dateTimePickerModalVal, setDateTimePickerModalVal] = useState(bookingStartTime.toDate());

    const [radius, setRadius] = useState(10);

    const location = useSelector((state) => {
        return state.searchParameters.location;
    });

    useEffect(() => {
        LogBox.ignoreLogs(['Setting a timer']);
        let interval = null;
        let timeout = setTimeout(() => {
            setNow(moment(now).add(5, 'minutes'));

            interval = setInterval(() => {
                setNow(now => moment(now).add(5, 'minutes'));
            }, 300000);
        }, now.valueOf() - Date.now());

        return () => {
            console.log("clear timeout/interval");
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    useEffect(() => {
        if (bookingStartTime.isSameOrBefore(now)) {
            setBookingStartTime(moment(now));
        }
    }, [now]);

    useEffect(() => {
        if (bookingStartTime.isSameOrAfter(bookingEndTime)) {
            setBookingEndTime(moment(bookingStartTime).add(5, 'minutes'));
        }
    }, [bookingStartTime]);

    const pickerConfirm = (date) => {
        let inputtedTime = moment(date);
        let currTime = currentTimeCeiledTo5min();
        let timeIn6months = moment(currTime).add(6, 'months');

        switch (pickerType) {
            case TYPE_START:
                if (bookingEndTime && inputtedTime.isSameOrAfter(bookingEndTime)) {
                    setBookingEndTime(moment(inputtedTime).add(2, 'hours'));
                }
                /*if(inputtedTime.isBefore(currTime)) { //This likely isn't needed anymore.
                    inputtedTime = currTime;
                }*/
                setBookingStartTime(inputtedTime);
                break;
            case TYPE_END:
                if (inputtedTime.isSameOrBefore(bookingStartTime)) {
                    setBookingStartTime(currentTimeCeiledTo5min());
                }
                /*if(inputtedTime.isAfter(timeIn6months)) { //This likely isn't needed anymore.
                    inputtedTime = timeIn6months;
                }*/
                setBookingEndTime(inputtedTime);
                break;
        }
        resetPicker();
    }

    const resetPicker = () => {
        setPickerVisible(false);
    }

    const openModal = (dateType) => {
        setPickerType(dateType);
        setPickerVisible(true);
    }

    function clickedSearch(props) {
        dispatch(ChangeFilters.action({
            filters: [
                {
                    filterType: "locationRadius",
                    locationCenter: {
                        lat: location.latitude,
                        lng: location.longitude,
                    },
                    radius: {
                        size: radius,
                    }
                },
                {
                    filterType: "timeSlot",
                    bookingDesiredStart: bookingStartTime.unix() / 60,
                    bookingDesiredEnd: bookingEndTime.unix() / 60
                }
            ]
        }));
        props.navigation.navigate("ParkingSpotResults");
    }

    return (
        <View style={[Layout.alignItemsStart, Layout.fill]}>
            <View style={[Layout.fullWidth, Layout.typicalMap ]} >
                <MapView
                    style={[Layout.fill, Layout.selfStretch]}
                    region={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: ((radius + 10) * 2) / 111,
                        longitudeDelta: ((radius + 10) * 2) / 111,
                    }}
                >
                    <Circle
                        center={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                        radius={radius * 1000}
                        fillColor={"rgba(34, 184, 230, 0.25)"}
                    />
                    {location &&
                    <Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                    />
                    }
                </MapView>
            </View>
            <View style={[Layout.fullWidth]}>
                <View style={[Layout.row, Layout.justifyContentBetween, Layout.searchRadiusWrapper]}>
                    <Text>Search Radius</Text>
                    <Text>{prettyRadius(radius)} km</Text>
                </View>
                <View style={[Layout.fullWidth]}>
                    <Slider
                        thumbTintColor="#54a3da"
                        minimumValue={1}
                        maximumValue={50}
                        style={[Layout.fullWidth]}
                        value={radius}
                        onValueChange={(val) => {
                            setRadius(val);
                        }}
                    />
                </View>
            </View>
            <View
                style={[
                    Layout.col,
                    Layout.fullWidth,
                    Layout.justifyContentAround,
                    {
                        flex: 2,
                        padding: 10
                    }
                ]}
            >
                <View style={[Layout.row]}>
                    <Text style={[{width: '40%', lineHeight: 30}]}>Booking Start Time</Text>
                    <TouchableOpacity
                        onPress={() => {
                            setMinDate(now.toDate());
                            setMaxDate(moment(now).add(6, 'months').toDate());
                            setDateTimePickerModalVal(bookingStartTime.toDate());
                            openModal(TYPE_START)
                        }}
                        style={[Layout.fill]}
                    >
                        <Surface style={[styles.surface]}>

                            {
                                <Text>{bookingStartTime.format("MMM Do YYYY - h:mm a")}</Text>
                            }
                        </Surface>
                    </TouchableOpacity>
                </View>

                <View style={[Layout.row]}>
                    <Text style={[{width: '40%', lineHeight: 30}]}>Booking End Time</Text>
                    <TouchableOpacity
                        onPress={() => {
                            setMinDate(now.toDate());
                            setMaxDate(moment(now).add(6, 'months').toDate());
                            setDateTimePickerModalVal(bookingEndTime.toDate());
                            openModal(TYPE_END);
                        }}
                        style={[Layout.fill]}
                    >
                        <Surface style={styles.surface}>

                            {
                                <Text>{bookingEndTime.format("MMM Do YYYY - h:mm a")}</Text>
                            }
                        </Surface>
                    </TouchableOpacity>
                </View>
                <View>
                    <Button onPress={() => clickedSearch(props)} mode={"contained"}> Search </Button>
                </View>
            </View>
            <DateTimePickerModal
                isVisible={pickerVisible}
                mode={"datetime"}
                onCancel={resetPicker}
                onConfirm={pickerConfirm}
                minuteInterval={5}
                minimumDate={minDate}
                maximumDate={maxDate}
                date={dateTimePickerModalVal}
            />
        </View>
    )
}

export default IndexParametersContainer
