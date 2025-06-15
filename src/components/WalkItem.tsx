// src/components/WalkItem.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WalkItem = ({ walk }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('walkdetails', { walk })}
    >
      <Text>Date: {new Date(walk.timestamp).toLocaleString()}</Text>
      <Text>
        Duration: {Math.floor(walk.duration / 60)} min {walk.duration % 60} sec
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 16,
    backgroundColor: '#eee',
    marginBottom: 10,
    borderRadius: 8,
  },
});

export default WalkItem;
