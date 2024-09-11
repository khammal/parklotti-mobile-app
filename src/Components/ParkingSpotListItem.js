import React, {useState, useEffect} from 'react'
import {Dimensions, Text, TouchableOpacity, View} from "react-native";
import {SliderBox} from "react-native-image-slider-box";
import {useTheme} from "@/Theme";
import ChangeParkingSpot from "@/Store/ParkingSpot/ChangeParkingSpot";
import {useDispatch} from "react-redux";
import moment from "moment";

const ParkingSpotListItem = (props) => {
    const {Layout} = useTheme()
    const dispatch = useDispatch();

    const [bottomText, setBottomText] = useState(null);

    useEffect(() => {
        let newText = null;
        for(let filter of props.data?.filters ?? []) {
            if(filter.filterType === "timeSlot") {
                newText = moment.unix(filter.bookingDesiredStart * 60).format("MMM Do YYYY - h:mm a") + " - " +
                    moment.unix(filter.bookingDesiredEnd * 60).format("MMM Do YYYY - h:mm a");
                break;
            }
        }
        setBottomText(newText);
    }, [props.data]);

    function clickedParkingSpot(id) {
        dispatch(ChangeParkingSpot.action({
            parkingSpotId: id
        }));
        props.navigation.navigate("ParkingSpot");
    }

    return (
        <TouchableOpacity onPress={() => clickedParkingSpot(props.data._id)}>
            <View style={[Layout.parkingSpotResult]}>
                <View style={[Layout.sliderBoxBanner]}>
                    <Text style={[Layout.sliderBoxBannerText]}>{props.data.name}</Text>
                </View>
                <View style={[{overflow: 'hidden'}]}>
                    <SliderBox
                        style={[{height: 150, width: Dimensions.get('window').width - 50}]}
                        images={props.data.images}
                        sliderBoxHeight={150}
                        dotColor="#54a3da"
                        inactiveDotColor="#90A4AE"
                        circleLoop
                    />
                </View>

                {bottomText &&
                    <View style={[Layout.sliderBoxBottomBanner]}>
                        <Text style={[Layout.sliderBoxBannerText]}>{bottomText}</Text>
                    </View>
                }
            </View>
        </TouchableOpacity>
    )
}
export default ParkingSpotListItem;