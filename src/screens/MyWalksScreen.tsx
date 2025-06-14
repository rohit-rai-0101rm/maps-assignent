import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WalksScreen = () => {
  const [walks, setWalks] = useState([]);

  useEffect(() => {
    const fetchWalks = async () => {
      try {
        const data = await AsyncStorage.getItem('walks');
        if (data) {
          setWalks(JSON.parse(data));
        }
      } catch (err) {
        console.log('Failed to load walks', err);
      }
    };
    fetchWalks();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>Date: {new Date(item.timestamp).toLocaleString()}</Text>
      <Text>
        Duration: {Math.floor(item.duration / 60)} min {item.duration % 60} sec
      </Text>
      <Text>Points: {item.route.length}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={walks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No walks found</Text>}
      />
    </View>
  );
};

export default WalksScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
});
