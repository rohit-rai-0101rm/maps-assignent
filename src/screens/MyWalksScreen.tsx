import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const WalksScreen = () => {
  const [walks, setWalks] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadWalks = async () => {
      const data = await AsyncStorage.getItem('walks');
      if (data) {
        setWalks(JSON.parse(data));
      }
    };
    loadWalks();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('walkdetails', { walk: item })}
    >
      <Text>Date: {new Date(item.timestamp).toLocaleString()}</Text>
      <Text>
        Duration: {Math.floor(item.duration / 60)} min {item.duration % 60} sec
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={walks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default WalksScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: {
    padding: 16,
    backgroundColor: '#eee',
    marginBottom: 10,
    borderRadius: 8,
  },
});
