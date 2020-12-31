import React, {useState, useMemo, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  PanResponder,
  Text,
} from 'react-native';

//COMPONENTS
import Map from './components/Map';

//CONSTANTS
import COLORS from './constants/Colors';

//FUNCTIONS
import movingAverage from './functions/movingAverage';

//LIBRARIES
import * as d3 from 'd3';

//DATA
import covidData_raw from './assets/data/who_data.json';

const AnimatedMapView = Animated.createAnimatedComponent(Map);


export default function App(props) {
  const [rotateX, setrotateX] = useState(new Animated.Value(-90));
  const [rotateZ, setrotateZ] = useState(new Animated.Value(0));
  const [fromXY, setfromXY] = useState(undefined);
  const [valueXY, setvalueXY] = useState(undefined);

  const onMoveEnd = () => {
    this.setState({
      fromXY: undefined,
    });
  };

  const onMove = (e) => {
    let {pageX, pageY} = e.nativeEvent,
      {rotateX, rotateZ, fromXY, valueXY} = this.state;
    if (!this.state.fromXY) {
      this.setState({
        fromXY: [pageX, pageY],
        valueXY: [rotateZ.__getValue(), rotateX.__getValue()],
      });
    } else {
      rotateZ.setValue(valueXY[0] + (pageX - fromXY[0]) / 2);
      rotateX.setValue(valueXY[1] + (pageY - fromXY[1]) / 2);
    }
  };

  const handlePanResponderMove = (e, gestureState) => {
    console.log(gestureState, 'gestureState');

    const {dx, dy} = gestureState;
    const y = `${dx}deg`;
    const x = `${-dy}deg`;
    this.refView.setNativeProps({
      style: {transform: [{perspective: 1000}, {rotateX: x}, {rotateY: y}]},
    });
  };

  useEffect(() => {
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: handlePanResponderMove.bind(this),
    });
  }, []);

  const dimensions = Dimensions.get('window');

  const [stat, setStat] = useState('avg_confirmed');
  const [date, setDate] = useState('2020-04-24');

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

  return (
    <View style={styles.container}>
      <Animated.View>
        <Text>ddd</Text>
      </Animated.View>
      {/* <Map
        dimensions={dimensions}
        data={covidData}
        date={date}
        colorize={colorize}
        stat={stat}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
