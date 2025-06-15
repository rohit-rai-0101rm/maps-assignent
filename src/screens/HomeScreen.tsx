import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MapView, { Polyline, Region as MapRegion } from 'react-native-maps';
import ControlButton from '../components/ControlButtons';
import useLocation from '../hooks/useLocation';
import useWalkTracker from '../hooks/useWalkTracker';
import { formatTime } from '../utils';

const HomeScreen = () => {
  const { isWalking, routeCoordinates, elapsedTime, startWalk, stopWalk } =
    useWalkTracker(); // Hook for walk tracking
  const navigation = useNavigation();

  const { region, fetchLocation, loading: locationLoading } = useLocation();
  const [locationFetched, setLocationFetched] = useState(false); // Track whether location is fetched

  // Reset state when the screen is focused
  useFocusEffect(
    useCallback(() => {
      setLocationFetched(false); // Reset the state when the user comes back to this screen
    }, []),
  );

  const latestCoord = routeCoordinates[routeCoordinates.length - 1];

  // If region is not available, show the fetch location button
  if (!region || !locationFetched) {
    return (
      <View style={styles.center}>
        <ControlButton
          title={locationLoading ? 'Loading...' : 'Fetch Current Location'}
          onPress={() => {
            fetchLocation(); // Fetch the location
            setLocationFetched(true); // Mark location as fetched
          }}
          disabled={locationLoading}
          backgroundColor="#F0597A"
        />
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
            strokeColor="#1a73e8" // Google Maps-like blue color
            strokeWidth={6}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapView>

      <View style={styles.controls}>
        <ControlButton
          title={isWalking ? 'Stop Walk' : 'Start Walk'}
          onPress={isWalking ? stopWalk : startWalk}
          backgroundColor={isWalking ? '#982F53' : '#F0597A'}
        />
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

        <ControlButton
          title="My Walks"
          onPress={() => navigation.navigate('mywalks')}
          backgroundColor="#333"
        />
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
