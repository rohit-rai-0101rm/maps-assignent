// useLocation.ts
import { useState } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';

const useLocation = () => {
    const [region, setRegion] = useState<GeolocationResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchLocation = async () => {
        setLoading(true);
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'App needs access to your location.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert(
                        'Permission Denied',
                        'Location permission is required to use this feature.',
                    );
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.warn(err);
                setLoading(false);
                return;
            }
        }

        Geolocation.getCurrentPosition(
            (position: GeolocationResponse) => {
                const { latitude, longitude } = position.coords;
                setRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
                setLoading(false);
            },
            error => {
                Alert.alert('Error', 'Failed to get current location');
                console.log(error);
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    };

    return { region, loading, fetchLocation };
};

export default useLocation;
