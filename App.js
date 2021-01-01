import React, {useState, useMemo, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  PanResponder,
  Text,
  SafeAreaView,
} from 'react-native';

import Map from './components/Map';

import COLORS from './constants/Colors';
import movingAverage from './functions/movingAverage';
import * as d3 from 'd3';
import covidData_raw from './assets/data/who_data.json';


export default function App(props) {

  const [rotateX, setrotateX] = React.useState(0);
  const [rotateY, setrotateY] = React.useState(0);

  const handlePanResponderMove = (e, gestureState) => {
    console.log(rotateX, 'gestureState');

    const {dx, dy} = gestureState;
    const y = `${dx}deg`;
    const x = `${-dy}deg`;

    setrotateX(dx);
    setrotateY(dy);
  };

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderMove: (evt, gestureState) => {
          handlePanResponderMove(evt, gestureState);
        },
        onPanResponderRelease: (evt, gestureState) => {},
      }),
    [rotateX],
  );

  const dimensions = Dimensions.get('window');

  //Data Manipulation
  const covidData = useMemo(() => {
    const countriesAsArray = Object.keys(covidData_raw).map((key) => ({
      name: key,
      data: covidData_raw[key],
    }));

    const windowSize = 7;

    const countriesWithAvg = countriesAsArray.map((country) => ({
      name: country.name,
      data: [...movingAverage(country.data, windowSize)],
    }));

    const onlyCountriesWithData = countriesWithAvg.filter(
      (country) => country.data.findIndex((d, _) => d[stat] >= 10) != -1,
    );

    return onlyCountriesWithData;
  }, []);

  const maxY = useMemo(() => {
    return d3.max(covidData, (country) => d3.max(country.data, (d) => d[stat]));
  }, [stat]);

  const colorize = useMemo(() => {
    const colorScale = d3
      .scaleSequentialSymlog(d3.interpolateReds)
      .domain([0, maxY]);

    return colorScale;
  });

  React.useEffect(() => {}, [handlePanResponderMove, setrotateX]);

  return (
    <SafeAreaView>
      <View
        {...panResponder.panHandlers}
      >
        
        <Map
          dimensions={dimensions}
          data={covidData}
          date={date}
          colorize={colorize}
          stat={stat}
          rotateX={rotateX}
          rotateY={rotateY}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotateView: {
    width: 300,
    height: 300,
    backgroundColor: 'black',
    shadowOpacity: 0.2,
  },
});
