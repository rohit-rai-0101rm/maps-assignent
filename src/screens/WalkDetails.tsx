import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { formatTime } from '../utils';
import { calculateDistance } from '../utils/calculateDistance';

const WalkDetailScreen = ({ route }) => {
  const { walk } = route.params;

  const totalDistance = useMemo(() => {
    if (walk.route.length < 2) return 0;
    return calculateDistance(walk.route);
  }, [walk.route]);

  const walkDate = useMemo(() => {
    const date = new Date(walk.timestamp);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, [walk.timestamp]);

  const initialRegion = {
    latitude: walk.route[0].latitude,
    longitude: walk.route[0].longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const startCoord = walk.route[0];
  const endCoord = walk.route[walk.route.length - 1];

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        <Polyline
          coordinates={walk.route}
          strokeColor="#F0597A"
          strokeWidth={5}
          lineCap="round"
          lineJoin="round"
        />
        <Marker
          coordinate={startCoord}
          title="Start"
          description="Walk Start"
          pinColor="red"
        />
        <Marker
          coordinate={endCoord}
          title="End"
          description="Walk End"
          pinColor="green"
        />
      </MapView>

      <View style={styles.statsCard}>
        <Text style={styles.dateText}>{walkDate}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatTime(walk.duration)}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalDistance.toFixed(2)} km</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{walk.route.length}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  statsCard: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F0597A',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textTransform: 'uppercase',
  },
});

export default WalkDetailScreen;
