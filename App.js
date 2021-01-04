import React, {useState, useMemo} from 'react';
import {View, Dimensions, SafeAreaView} from 'react-native';

import Map from './components/Map';

export default function App() {
  const dimensions = Dimensions.get('window');
  const [stat] = useState('avg_confirmed');
  const [] = useState('2020-04-24');

  //first should be longitude
  const coordinates_data = [
    [19.744822, -34.633016],
    [80.229349, 9.818078],
    [-98.862052, 37.848794],
  ];

  return (
    <SafeAreaView>
      <View>
        <Map dimensions={dimensions} coordinates={coordinates_data} />
      </View>
    </SafeAreaView>
  );
}
