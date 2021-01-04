import {feature} from 'topojson-client';
// import countries from '../assets/data/countries-50m.json';
import countries from '../assets/data/countries-110m.json';
// import countries from '../assets/data/countries_simplified.json';
export const COUNTRIES = feature(countries, countries.objects.countries)
  .features;
