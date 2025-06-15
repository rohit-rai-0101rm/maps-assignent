// HomeScreen.tsx
import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, { Polyline, Region as MapRegion } from 'react-native-maps';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { formatTime } from '../utils';

type WalkData = {
  timestamp: number;
  duration: number;
  route: { latitude: number; longitude: number }[];
};

const HomeScreen = () => {
  const [region, setRegion] = useState<MapRegion | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [routeCoordinates, setRouteCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      if (!isWalking) {
        setRegion(null);
        setRouteCoordinates([]); // Clear route coords on focus if not walking
      }
    }, [isWalking]),
  );

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
    setLocationPermission(true);

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

  const startWalk = () => {
    setRouteCoordinates([]);
    setElapsedTime(0);
    setIsWalking(true);

    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    watchIdRef.current = Geolocation.watchPosition(
      (position: GeolocationResponse) => {
        const { latitude, longitude } = position.coords;
        setRegion(prev => ({
          ...prev,
          latitude,
          longitude,
        }));
        setRouteCoordinates(prev => [...prev, { latitude, longitude }]);
      },
      error => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 1,
        interval: 5000,
        fastestInterval: 2000,
      },
    );
  };

  const stopWalk = async () => {
    setIsWalking(false);
    if (watchIdRef.current !== null) {
      Geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
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
        `Duration: ${formatTime(elapsedTime)}\nPoints tracked: ${
          routeCoordinates.length
        }`,
      );
    } catch (err) {
      console.log('Failed to save walk', err);
    }

    // Clear polyline after walk
    setRouteCoordinates([]);
  };

  const latestCoord = routeCoordinates[routeCoordinates.length - 1];

  if (!region) {
    return (
      <View style={styles.center}>
        <TouchableOpacity
          style={styles.fetchButton}
          onPress={fetchLocation}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Fetch Current Location</Text>
          )}
        </TouchableOpacity>
        <Text style={{ marginTop: 10 }}>Location is required to start</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} showsUserLocation={true}>
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#4285F4"
            strokeWidth={6}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapView>

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={isWalking ? stopWalk : startWalk}
          style={[
            styles.button,
            { backgroundColor: isWalking ? '#982F53' : '#F0597A' },
          ]}
        >
          <Text style={styles.buttonText}>
            {isWalking ? 'Stop Walk' : 'Start Walk'}
          </Text>
        </TouchableOpacity>

        {isWalking && (
          <>
            <Text style={styles.timer}>Time: {formatTime(elapsedTime)}</Text>
            {latestCoord && (
              <Text style={styles.coordText}>
                Lat: {latestCoord.latitude.toFixed(5)} | Lng:{' '}
                {latestCoord.longitude.toFixed(5)}
              </Text>
            )}
          </>
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate('mywalks')}
          style={[styles.button, styles.myWalksButton]}
        >
          <Text style={styles.buttonText}>My Walks</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
  },
  fetchButton: {
    backgroundColor: '#F0597A',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
  },
  myWalksButton: {
    backgroundColor: '#333',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  timer: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  coordText: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 4,
    borderRadius: 6,
  },
});

export default HomeScreen;
