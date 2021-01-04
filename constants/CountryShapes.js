import {feature} from 'topojson-client';
// import countries from '../assets/data/countries-50m.json';
import countries from '../assets/data/countries-110m.json';
// import countries from '../assets/data/countries_simplified.json';
export const COUNTRIES = feature(countries, countries.objects.countries)
  .features;

//[31.887318873188747, -21.831352380242535]  [31.43011430114302, -22.298337309310583], [31.28611286112863, -22.40249751653765]
