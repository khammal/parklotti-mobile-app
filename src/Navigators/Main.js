import React from 'react'
import {
    IndexCreatePostingContainer,
    IndexHomeContainer,
    IndexParametersContainer,
    IndexParkingSpotContainer,
    IndexParkingSpotResultsContainer,
    IndexAccountContainer,
    IndexSearchListContainer
} from '@/Containers'
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import CustomNavigationBar from "@/Navigators/CustomNavigationBar";
import { IconButton } from 'react-native-paper';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                header: (props) => <CustomNavigationBar {...props} />,
            }}
            initialRouteName={"Home"}
        >
            <Stack.Screen
                name="Home"
                component={IndexHomeContainer}
            />
            <Stack.Screen
                name="SearchList"
                component={IndexSearchListContainer}
            />
            <Stack.Screen
                name="Parameters"
                component={IndexParametersContainer}
                initialParams={{title: "Narrow Down Your Search"}}
            />
            <Stack.Screen
                name="ParkingSpotResults"
                component={IndexParkingSpotResultsContainer}
                initialParams={{title: ""}}
            />
            <Stack.Screen
                name="ParkingSpot"
                component={IndexParkingSpotContainer}
                initialParams={{title: ""}}
            />
            <Stack.Screen
                name="CreatePosting"
                component={IndexCreatePostingContainer}
                initialParams={{title: "Create"}}
            />
        </Stack.Navigator>
    );
}

const AccountStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                header: (props) => <CustomNavigationBar {...props} />,
            }}
        >
            <Stack.Screen
                name="Account"
                component={IndexAccountContainer}
                initialParams={{title: "Login to Parklotti"}}
            />
            <Stack.Screen
                name={"CreatePosting"}
                component={IndexCreatePostingContainer}
                initialParams={{title: "Create"}}
                />
        </Stack.Navigator>
    );
}

getTabBarVisibility = (route) => {
    const routesToDisableBarOn = ["SearchList", "ParkingSpot"];
    const routeName = getFocusedRouteNameFromRoute(route) ?? '';

    if(routesToDisableBarOn.includes(routeName)) {
        return false;
    }
    return true;
}

// @refresh reset
const MainNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Account') {
                        iconName = focused ? 'account' : 'account-outline';
                    }

                    return <IconButton icon={iconName} color={color} size={size} />
                },
            })}
            tabBarOptions={{
                activeTintColor: "#54a3da",
                inactiveTintColor: "#262161",
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={({ route }) => {
                    return ({
                        tabBarVisible: getTabBarVisibility(route)
                    })
                }}
            />
            <Tab.Screen name="Account" component={AccountStack} />
        </Tab.Navigator>
    )
}

export default MainNavigator
