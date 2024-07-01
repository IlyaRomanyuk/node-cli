import axios from 'axios';
import { getKeyValue, TOKEN_DICTIONARY } from './storage.service.js';

const getCoordinates = async (city) => {
  const token = process.env.TOKEN ?? (await getKeyValue(TOKEN_DICTIONARY.token));
  if (!token) {
    throw new Error('Не задан ключ API, задайте его через команду -t [API_KEY]');
  }
  const { data } = await axios.get('http://api.openweathermap.org/geo/1.0/direct', {
    params: {
      q: city,
      limit: 1,
      appid: token,
    },
  });
  return data;
};

const getWeather = async (lat, lon) => {
  const token = process.env.TOKEN ?? (await getKeyValue(TOKEN_DICTIONARY.token));
  if (!token) {
    throw new Error('Не задан ключ API, задайте его через команду -t [API_KEY]');
  }
  const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
    params: {
      lat,
      lon,
      appid: token,
      lang: 'ru',
      units: 'metric',
    },
  });
  return data;
};

export { getCoordinates, getWeather };
