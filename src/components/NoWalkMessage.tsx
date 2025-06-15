// src/components/NoWalksMessage.tsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';

const NoWalksMessage = () => (
  <Text style={styles.emptyMessage}>No saved walks yet.</Text>
);

const styles = StyleSheet.create({
  emptyMessage: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default NoWalksMessage;
