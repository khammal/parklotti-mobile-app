import AsyncStorage from '@react-native-async-storage/async-storage';

export default async () => {
    const defaultData = {
        bookings: []
    }
    try {
        const value = await AsyncStorage.getItem('@user_data');
        return value != null ? JSON.parse(value) : defaultData;
    } catch (e) {
        console.error(e);
        return defaultData;
    }
}