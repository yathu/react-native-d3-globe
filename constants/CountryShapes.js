import {feature} from 'topojson-client';
import countries from '../assets/data/countries-110m.json';
export const COUNTRIES = feature(countries, countries.objects.countries)
  .features;
