import React, {useMemo, useState, useEffect} from 'react';
import {StyleSheet, View, Animated, InteractionManager} from 'react-native';

//LIBRARIES
import Svg, {G, Path, Circle, Ellipse} from 'react-native-svg';
import * as d3 from 'd3';
import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
} from 'react-native-gesture-handler';

//CONSTANTS
import {COUNTRIES} from '../constants/CountryShapes';
import COLORS from '../constants/Colors';

//COMPONENTS

const Map = (props) => {
  const [countryList, setCountryList] = useState([]);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(-90);
  const [lastTranslateX, setLastTranslateX] = useState(0);
  const [lastTranslateY, setLastTranslateY] = useState(0);
  const [buttonOpacity] = useState(new Animated.Value(0));
  const [scale, setScale] = useState(1);
  const [prevScale, setPrevScale] = useState(1);
  const [lastScaleOffset, setLastScaleOffset] = useState(0);

  const [pointers, setPointers] = useState([]);
  const [markers, setMarkers] = useState([]);

  const {dimensions, data} = props;

  //Gesture Handlers
  const panStateHandler = (event) => {
    if (event.nativeEvent.oldState === State.UNDETERMINED) {
      setLastTranslateX(translateX);
      setLastTranslateY(translateY);
    }

    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  };

  const panGestureHandler = (event) => {
    setTranslateX(-event.nativeEvent.translationX / scale + lastTranslateX);
    setTranslateY(-event.nativeEvent.translationY / scale + lastTranslateY);
  };

  const pinchStateHandler = (event) => {
    if (event.nativeEvent.oldState === State.UNDETERMINED) {
      setLastScaleOffset(-1 + scale);
    }

    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  };

  const pinchGestureHandler = (event) => {
    if (
      event.nativeEvent.scale + lastScaleOffset >= 1 &&
      event.nativeEvent.scale + lastScaleOffset <= 5
    ) {
      setPrevScale(scale);
      setScale(event.nativeEvent.scale + lastScaleOffset);
      setTranslateX(
        translateX -
          (event.nativeEvent.focalX / scale -
            event.nativeEvent.focalX / prevScale),
      );
      setTranslateY(
        translateY -
          (event.nativeEvent.focalY / scale -
            event.nativeEvent.focalY / prevScale),
      );
    }
  };

  //Initialize Map Transforms

  //Create Map Paths
  const mapExtent = useMemo(() => {
    return dimensions.width > dimensions.height / 2
      ? dimensions.height / 2
      : dimensions.width;
  }, [dimensions, translateX,translateY]);

  const countryPaths = useMemo(() => {
    const clipAngle = 90;

    const projection = d3
      .geoOrthographic()
      .rotate([-translateX, translateY])
      .scale(mapExtent / 2)
      .clipAngle(clipAngle)
      .translate([dimensions.width / 2, mapExtent / 2]);

    const geoPath = d3.geoPath().projection(projection);

    const windowPaths = COUNTRIES.map(geoPath);

    const pointers = data.map((data: any) => {
      //calculate xy position from coordinates (long,lat)
      const lang = data[0];
      const lat = data[1];

      const xdata = projection([lang, lat])[0]; //first should be longitude
      const ydata = projection([lang, lat])[1];

      //if marker out of circle or back side marker will hide
      const centerPos = projection.invert([
        dimensions.width / 2,
        mapExtent / 2,
      ]);
      const d = d3.geoDistance([lang, lat], centerPos);
      const opacity = d > 1.57 ? 0 : 1;

      return [xdata, ydata, opacity];
    });

    setPointers(pointers);

    return windowPaths;
  }, [dimensions,translateX,translateY]);

  useEffect(() => {
    setCountryList(
      countryPaths.map((path, i) => {
        return (
          <Path
            key={i}
            d={path}
            stroke={COLORS.greyDark}
            strokeOpacity={0.3}
            strokeWidth={0.6}
            fill={COLORS.contry}
            opacity={1}
          />
        );
      }),
    );

    setMarkers(
      pointers.map((xydata) => {
        return (
          <Circle
            key={xydata[0]}
            cx={xydata[0]}
            cy={xydata[1]}
            r={7}
            opacity={xydata[2]}
            fill="yellow"
          />
        );
      }),
    );
  }, [translateX,translateY]);

  return (
    <View>
      <PanGestureHandler
        onGestureEvent={(e) => panGestureHandler(e)}
        onHandlerStateChange={(e) => panStateHandler(e)}>
        <PinchGestureHandler
          onGestureEvent={(e) => pinchGestureHandler(e)}
          onHandlerStateChange={(e) => pinchStateHandler(e)}>
          <Svg
            width={dimensions.width}
            height={dimensions.height / 2}
            style={styles.svg}>
            <G
              transform={`scale(1)`}
              // transform={`scale(${scale}) translate(${-translateX},${-translateY})`}
            >
              <Circle
                cx={dimensions.width / 2}
                cy={mapExtent / 2}
                r={mapExtent / 2}
                fill={COLORS.sea}
              />
              {countryList.map((x) => x)}

              {markers.map((marker) => marker)}
            </G>
          </Svg>
        </PinchGestureHandler>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  svg: {},
  rotateView: {
    width: 100,
    height: 400,
    backgroundColor: 'black',
    shadowOffset: {height: 1, width: 1},
    shadowOpacity: 0.2,
  },
});

export default Map;
