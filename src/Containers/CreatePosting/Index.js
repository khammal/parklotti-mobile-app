import React, {useState} from 'react'
import {ScrollView, View, YellowBox, StyleSheet, Dimensions} from 'react-native'
import {useTheme} from '@/Theme'
import {Button, Menu, TextInput} from "react-native-paper";
import {Formik} from 'formik';
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {GOOGLE_MAPS_API_KEY} from "@env";
import ImagePicker from 'react-native-image-picker';
import Carousel, {ParallaxImage} from "react-native-snap-carousel";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import AddSpot from "@/Store/LocalStorageParking/AddSpot";
import {useDispatch} from "react-redux";
import CreateParkingSpotPosting from '@/Services/ParkingSpots/CreatePosting';

YellowBox.ignoreWarnings(['VirtualizedLists should never be nested',]);// TODO: Remove when fixed
const { width: screenWidth } = Dimensions.get('window');

const IndexCreatePostingContainer = (props) => {
    const {Layout} = useTheme();
    const [typeDropdown, setTypeDropDown] = useState(false);
    const dispatch = useDispatch();

    const openMenu = () => setTypeDropDown(true);

    const closeMenu = () => setTypeDropDown(false);

    const renderCarouselItem = ({item, index}, parallaxProps) => {
        return <View style={{
            marginTop: 10,
            width: screenWidth - 50,
            height: screenWidth - 50,
        }}>
            <ParallaxImage
                source={{ uri: item }}
                containerStyle={{
                    flex: 1,
                    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
                    backgroundColor: 'white',
                    borderRadius: 8,
                }}
                style={{
                    ...StyleSheet.absoluteFillObject,
                    resizeMode: 'cover',
                }}
                parallaxFactor={0.4}
                {...parallaxProps}
            />
        </View>
    };

    function checkFormValidity(values) {
        let valid = true;
        if(values.images.length === 0) {
            valid = false;
        } else {
            for (let key in values) {
                if (values[key] === '') {
                    valid = false;
                }
            }
            for(let key in values.location) {
                if (values[key] === '') {
                    valid = false;
                }
            }
        }
        return valid;
    }

    return (
        <View style={[Layout.fill]}>
            <Formik
                initialValues={{
                    _id: uuidv4(),
                    name: '',
                    description: '',
                    type: '',
                    location: {
                        countryRegion: '',
                        street: '',
                        city: "",
                        administrativeArea: "",
                        postcode: "",
                        lat: '',
                        lng: '',
                    },
                    images: [],
                    flags: [],
                }}
                onSubmit={() => {}}
            >{(
                {
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue
                }
            ) => (
                <>
                    <ScrollView
                        keyboardShouldPersistTaps={'handled'}
                        style={[Layout.fill, {backgroundColor: 'white'}]}
                    >
                        <View style={[{
                            flex: 1,
                            paddingRight: 25,
                            paddingLeft: 25,
                            paddingTop: 0,
                            paddingBottom: 10
                        }]}>
                            <GooglePlacesAutocomplete
                                placeholder='Enter Location...'
                                onPress={(data, details = null) => {
                                    let newValues = {
                                        lat: details?.geometry?.location?.lat ?? '',
                                        lng: details?.geometry?.location?.lng ?? '',
                                    }
                                    let streetNum = '';
                                    let road = '';
                                    for (let component of details.address_components) {
                                        if (component?.types.includes("country")) {
                                            newValues.countryRegion = component.short_name;
                                        }

                                        if (component?.types.includes("administrative_area_level_1")) {
                                            newValues.countryRegion = component.short_name;
                                        }
                                        if (component?.types.includes("locality")) {
                                            newValues.administrativeArea = component.long_name;
                                        }
                                        if (component?.types.includes("postal_code")) {
                                            newValues.postcode = component.long_name;
                                        }

                                        if (component?.types.includes("street_number")) {
                                            streetNum = component.long_name;
                                        }
                                        if (component?.types.includes("route")) {
                                            road = component.short_name;
                                        }
                                    }
                                    newValues.street = `${streetNum} ${road}`
                                    setFieldValue('location', newValues);
                                }}
                                query={{
                                    key: GOOGLE_MAPS_API_KEY,
                                    language: 'en',
                                    sessiontoken: "sessiontest",
                                }}
                                filterReverseGeocodingByTypes={[
                                    "street_number"
                                ]}
                                fetchDetails={true}
                                minLength={3}
                                currentLocation={true}
                                currentLocationLabel='Current location'
                                textInputProps={{
                                    InputComp: TextInput,
                                    style: {marginHorizontal: 0, marginTop: 10, width: '100%'},
                                    mode: "outlined",
                                }}
                            />
                            <TextInput
                                style={{marginTop: 10}}
                                label={"Name"}
                                mode={"outlined"}
                                value={values.name}
                                onChangeText={(e) => {
                                    setFieldValue('name', e)
                                }}
                            />
                            <TextInput
                                style={{marginVertical: 10}}
                                label={"Description"}
                                mode={"outlined"}
                                multiline={true}
                                numberOfLines={5}
                                value={values.description}
                                onChangeText={(e) => {
                                    setFieldValue('description', e)
                                }}
                            />
                            <Menu
                                visible={typeDropdown}
                                onDismiss={closeMenu}
                                anchor={<Button
                                    onPress={openMenu}
                                    mode={"contained"}
                                >{values.type === '' ? "Select Type" : `Type: ${values.type}`}</Button>}
                            >
                                <Menu.Item
                                    title={"Residential"}
                                    onPress={() => {
                                        closeMenu();
                                        setFieldValue('type', 'residential')
                                    }}
                                />
                                <Menu.Item
                                    title={"Commercial"}
                                    onPress={() => {
                                        closeMenu();
                                        setFieldValue('type', 'commercial')
                                    }}

                                />
                            </Menu>
                            <View>
                                <Button
                                    style={{marginTop: 10}}
                                    onPress={() => {
                                        ImagePicker.showImagePicker({}, res => {
                                            if (!res.didCancel && !res.error && !res.customButton) {
                                                setFieldValue('images', values.images.concat([
                                                        {uri: res.uri, name: res.fileName, type: res.type}
                                                    ])
                                                );
                                            }
                                        })
                                    }}
                                    mode={"contained"}
                                >
                                Add Images
                                </Button>

                                <Carousel
                                    sliderWidth={screenWidth-50}
                                    sliderHeight={screenWidth}
                                    itemWidth={screenWidth-50}
                                    data={values.images.map((img) => img.uri)}
                                    renderItem={renderCarouselItem}
                                    hasParallaxImages={true}
                                />
                            </View>
                        </View>


                    </ScrollView>
                    <View style={[Layout.padding25, Layout.whiteBg, Layout.boxShadow]}>
                        <Button mode="contained" disabled={!checkFormValidity(values)}
                            onPress={() => {
                                CreateParkingSpotPosting(values).then(response => {
                                    console.log(response);
                                    //setResults(parkingSpots);
                                    //setApiResponded(true);
                                }).catch(err => {
                                    console.error(err);
                                    //setResults([]);
                                });
                                //dispatch(AddSpot.action(values));
                                props.navigation.goBack();
                            }}
                        >
                            Create
                        </Button>
                    </View>
                </>
            )}
            </Formik>
        </View>
    )
}

export default IndexCreatePostingContainer
