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
  const dimensions = Dimensions.get('window');
  const [stat, setStat] = useState('avg_confirmed');
  const [date, setDate] = useState('2020-04-24');

  //first should be longitude
  const coordinates_data = [
    [19.744822, -34.633016],
    [80.229349, 9.818078],
    [-98.862052, 37.848794],
  ];

  //Data Manipulation
  const covidData = useMemo(() => {
    const countriesAsArray = Object.keys(covidData_raw).map((key) => ({
      name: key,
      data: covidData_raw[key],
    }));

    // console.log('countriesAsArray', JSON.stringify(countriesAsArray));

    const windowSize = 7;

    const countriesWithAvg = countriesAsArray.map((country) => ({
      name: country.name,
      data: [...movingAverage(country.data, windowSize)],

      // data: [...movingAverage(country.data, windowSize)],
    }));

    const onlyCountriesWithData = countriesWithAvg.filter(
      (country) => country.data.findIndex((d, _) => d[stat] >= 10) != -1,
    );

    return onlyCountriesWithData;
  }, []);

  // console.log('covidData:', JSON.stringify(covidData));

  const maxY = useMemo(() => {
    return d3.max(covidData, (country) => d3.max(country.data, (d) => d[stat]));
  }, [stat]);

  const colorize = useMemo(() => {
    const colorScale = d3
      .scaleSequentialSymlog(d3.interpolateReds)
      .domain([0, maxY]);

    return colorScale;
  });

  return (
    <SafeAreaView>
      <View>
        <Map
          dimensions={dimensions}
          data={covidData}
          date={date}
          colorize={colorize}
          stat={stat}
          coordinates={coordinates_data}
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
