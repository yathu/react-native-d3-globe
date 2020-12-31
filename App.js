import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
//COMPONENTS
import Map from './components/Map';
export default function App() {
  const dimensions = Dimensions.get('window');
  return (
    <View style={styles.container}>
      <Map dimensions={dimensions} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#323b44',
  },
});
