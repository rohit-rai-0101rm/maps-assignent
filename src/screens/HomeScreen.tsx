import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Alert,
  TouchableOpacity,
} from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [region, setRegion] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);

  const timerRef = useRef(null);
  const watchIdRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    requestLocationPermission();

    return () => {
      if (watchIdRef.current !== null)
        Geolocation.clearWatch(watchIdRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const requestLocationPermission = async () => {
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
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setLocationPermission(true);
          getCurrentLocation();
        } else {
          Alert.alert(
            'Permission Denied',
            'Location permission is required to use this feature.',
          );
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setLocationPermission(true);
      },
      error => {
        Alert.alert('Error', 'Failed to get current location');
        console.log(error);
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
      position => {
        const { latitude, longitude } = position.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
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

    const walkData = {
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
  };

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  if (!region) {
    return (
      <View style={styles.center}>
        <Text>Fetching current location...</Text>
      </View>
    );
  }

  const latestCoord = routeCoordinates[routeCoordinates.length - 1];

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} showsUserLocation={true}>
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#F0597A"
            strokeWidth={4}
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
          style={[styles.button, { backgroundColor: '#333', marginTop: 10 }]}
        >
          <Text style={styles.buttonText}>My Walks</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  controls: {
    position: 'absolute',
    bottom: 50,
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
