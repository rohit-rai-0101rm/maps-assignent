import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';

const WalkDetailScreen = ({ route }) => {
  const { walk } = route.params;
  const initialRegion = {
    latitude: walk.route[0].latitude,
    longitude: walk.route[0].longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} initialRegion={initialRegion}>
        <Polyline
          coordinates={walk.route}
          strokeColor="#F0597A"
          strokeWidth={4}
        />
      </MapView>
    </View>
  );
};

export default WalkDetailScreen;
