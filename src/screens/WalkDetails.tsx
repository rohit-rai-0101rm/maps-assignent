import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';

const WalkDetailScreen = ({ route }) => {
  const { walk } = route.params;

  // Initial region based on the starting point
  const initialRegion = {
    latitude: walk.route[0].latitude,
    longitude: walk.route[0].longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Start and end coordinates
  const startCoord = walk.route[0]; // First point
  const endCoord = walk.route[walk.route.length - 1]; // Last point

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} initialRegion={initialRegion}>
        {/* Polyline for the walk route */}
        <Polyline
          coordinates={walk.route}
          strokeColor="#F0597A" // Pinkish red for the polyline
          strokeWidth={4}
        />

        {/* Start Marker */}
        <Marker
          coordinate={startCoord}
          title="Start"
          description="Walk Start"
          pinColor="red" // Red marker for start
        />

        {/* End Marker */}
        <Marker
          coordinate={endCoord}
          title="End"
          description="Walk End"
          pinColor="green" // Green marker for end
        />
      </MapView>
    </View>
  );
};

export default WalkDetailScreen;
