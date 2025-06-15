// src/screens/WalksScreen.tsx
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import WalkItem from '../components/WalkItem';
import NoWalksMessage from '../components/NoWalkMessage';
import useWalks from '../hooks/useWalk';

const WalksScreen = () => {
  const walks = useWalks();

  const renderItem = ({ item }) => <WalkItem walk={item} />;

  return (
    <View style={styles.container}>
      {walks.length === 0 ? (
        <NoWalksMessage />
      ) : (
        <FlatList
          data={walks}
          keyExtractor={item => item.timestamp.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});

export default WalksScreen;
