import React, {useState, useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
//LIBRARIES
import Svg, {G, Path, Circle} from 'react-native-svg';
import * as d3 from 'd3';
//CONSTANTS
import {COUNTRIES} from '../constants/CountryShapes';


const Map = (props) => {
  const {dimensions} = props;
  const [countryList, setCountryList] = useState([]);


  const mapExtent = useMemo(() => {
    return dimensions.width > dimensions.height / 2
      ? dimensions.height / 2
      : dimensions.width;
  }, [dimensions]);

  
  const countryPaths = useMemo(() => {
    const projection = d3
      .geoAzimuthalEqualArea()
      .rotate([0, -90])
      .clipAngle(150)
      .fitSize([mapExtent, mapExtent], {
        type: 'FeatureCollection',
        features: COUNTRIES,
      })
      .translate([dimensions.width / 2, mapExtent / 2]);
    const geoPath = d3.geoPath().projection(projection);
    const svgPaths = COUNTRIES.map(geoPath);
    return svgPaths;
  }, [dimensions]);

  useEffect(() => {
    setCountryList(
      countryPaths.map((path, i) => {
        return (
          <Path
            key={COUNTRIES[i].properties.name}
            d={path}
            stroke={'#aaa'}
            strokeOpacity={0.3}
            strokeWidth={0.6}
            fill={'#aaa'}
            opacity={0.4}
          />
        );
      }),
    );
  }, []);

  return (
    <View>
      <Svg width={dimensions.width} height={dimensions.height / 2}>
        <G>
          <Circle
            cx={dimensions.width / 2}
            cy={mapExtent / 2}
            r={mapExtent / 2}
            fill={'#3b454f'}
          />
          {countryList.map((x) => x)}
        </G>
      </Svg>
    </View>
  );
};
export default Map;
