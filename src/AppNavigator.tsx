// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, MyWalksScreen } from './screens';
import WalkDetailScreen from './screens/WalkDetails';

export default function AppNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="mywalks" component={MyWalksScreen} />
        <Stack.Screen name="walkdetails" component={WalkDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
