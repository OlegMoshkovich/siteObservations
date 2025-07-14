import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AccessScreen() {
  return (
    <View style={styles.container}>
      <Text>Retrieve</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});