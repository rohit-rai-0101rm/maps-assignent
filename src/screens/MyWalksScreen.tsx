import React, { useMemo } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import WalkItem from '../components/WalkItem';
import NoWalksMessage from '../components/NoWalkMessage';

import { formatTime } from '../utils';
import useWalks from '../hooks/useWalk';

const WalksScreen = () => {
  const walks = useWalks();

  const { totalWalks, totalDuration, totalDistance } = useMemo(() => {
    const totalWalks = walks.length;
    const totalDuration = walks.reduce(
      (sum, walk) => sum + (walk.duration || 0),
      0,
    );
    const totalDistance = walks.reduce(
      (sum, walk) => sum + (walk.distance || 0),
      0,
    );
    return { totalWalks, totalDuration, totalDistance };
  }, [walks]);

  const renderItem = ({ item }) => <WalkItem walk={item} />;

  return (
    <View style={styles.container}>
      {walks.length > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{totalWalks}</Text>
            <Text style={styles.statLabel}>Total Walks</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{formatTime(totalDuration)}</Text>
            <Text style={styles.statLabel}>Total Time</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{totalDistance.toFixed(2)} km</Text>
            <Text style={styles.statLabel}>Total Distance</Text>
          </View>
        </View>
      )}

      {walks.length === 0 ? (
        <NoWalksMessage />
      ) : (
        <FlatList
          data={walks}
          keyExtractor={item => item.timestamp.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a73e8',
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});

export default WalksScreen;
