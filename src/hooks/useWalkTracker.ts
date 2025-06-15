// useWalkTracker.ts
import { useState, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatTime } from '../utils';

type WalkData = {
    timestamp: number;
    duration: number;
    route: { latitude: number; longitude: number }[];
};

const useWalkTracker = () => {
    const [isWalking, setIsWalking] = useState<boolean>(false);
    const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const watchIdRef = useRef<number | null>(null);

    const startWalk = useCallback(() => {
        setRouteCoordinates([]);  // Reset coordinates at the start of the walk
        setElapsedTime(0);  // Reset elapsed time
        setIsWalking(true); // Set walking state to true

        timerRef.current = setInterval(() => {
            setElapsedTime(prev => prev + 1); // Increase elapsed time by 1 every second
        }, 1000);

        watchIdRef.current = Geolocation.watchPosition(
            (position: GeolocationResponse) => {
                const { latitude, longitude } = position.coords;
                setRouteCoordinates(prev => [...prev, { latitude, longitude }]); // Append new coordinates
            },
            error => {
                console.log(error);
            },
            {
                enableHighAccuracy: true,
                distanceFilter: 1, // Update position when moving 1 meter
                interval: 5000,  // Update every 5 seconds
                fastestInterval: 2000, // Update every 2 seconds at the fastest
            },
        );
    }, []);

    const stopWalk = useCallback(async () => {
        setIsWalking(false);  // Set walking state to false
        if (watchIdRef.current !== null) {
            Geolocation.clearWatch(watchIdRef.current);  // Clear position watch
            watchIdRef.current = null;
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);  // Clear the timer
            timerRef.current = null;
        }

        const walkData: WalkData = {
            timestamp: Date.now(),
            duration: elapsedTime,
            route: routeCoordinates,
        };

        try {
            const existing = await AsyncStorage.getItem('walks');
            const walks = existing ? JSON.parse(existing) : [];
            walks.push(walkData);
            await AsyncStorage.setItem('walks', JSON.stringify(walks));
            Alert.alert(
                'Walk stopped',
                `Duration: ${formatTime(elapsedTime)}\nPoints tracked: ${routeCoordinates.length}`,
            );
        } catch (err) {
            console.log('Failed to save walk', err);
        }

        // Clear route coordinates after walk is saved
        setRouteCoordinates([]);
    }, [elapsedTime, routeCoordinates]);

    return { isWalking, routeCoordinates, elapsedTime, startWalk, stopWalk };
};

export default useWalkTracker;
