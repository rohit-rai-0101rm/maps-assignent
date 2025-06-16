import { useState, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatTime } from '../utils';
import { calculateDistance } from '../utils/calculateDistance';

type WalkData = {
    timestamp: number;
    duration: number;
    distance: number;
    route: { latitude: number; longitude: number }[];
};

const useWalkTracker = () => {
    const [isWalking, setIsWalking] = useState<boolean>(false);
    const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const watchIdRef = useRef<number | null>(null);

    const startWalk = useCallback(() => {
        setRouteCoordinates([]);
        setElapsedTime(0);
        setIsWalking(true);

        timerRef.current = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);

        watchIdRef.current = Geolocation.watchPosition(
            (position: GeolocationResponse) => {
                const { latitude, longitude } = position.coords;
                setRouteCoordinates(prev => [...prev, { latitude, longitude }]);
            },
            error => {
                console.log('Location error:', error);
            },
            {
                enableHighAccuracy: true,
                distanceFilter: 1,
                interval: 5000,
                fastestInterval: 2000,
            },
        );
    }, []);

    const stopWalk = useCallback(async () => {
        setIsWalking(false);

        if (watchIdRef.current !== null) {
            Geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        const distance = calculateDistance(routeCoordinates);

        const walkData: WalkData = {
            timestamp: Date.now(),
            duration: elapsedTime,
            distance,
            route: routeCoordinates,
        };

        try {
            const existing = await AsyncStorage.getItem('walks');
            const walks = existing ? JSON.parse(existing) : [];
            walks.push(walkData);
            await AsyncStorage.setItem('walks', JSON.stringify(walks));

            Alert.alert(
                'Walk saved',
                `🕒 Duration: ${formatTime(elapsedTime)}\n📍 Points: ${routeCoordinates.length}\n📏 Distance: ${distance.toFixed(2)} km`,
            );
        } catch (err) {
            console.log('Failed to save walk', err);
        }

        setRouteCoordinates([]);
    }, [elapsedTime, routeCoordinates]);

    return {
        isWalking,
        routeCoordinates,
        elapsedTime,
        startWalk,
        stopWalk,
    };
};

export default useWalkTracker;
