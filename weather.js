#!/usr/bin/env node
import { getArgs } from './helpers/index.js';
import { printError, printSuccess, printHelp, printWeather } from './services/log.service.js';
import { saveKeyValue, TOKEN_DICTIONARY, getKeyValue } from './services/storage.service.js';
import { getCoordinates, getWeather } from './services/api.service.js';

const saveToken = async (token) => {
  if (!token.length) {
    printError('Токен не передан');
    return;
  }
  try {
    await saveKeyValue(TOKEN_DICTIONARY.token, token);
    printSuccess('Токен сохранен успешно');
  } catch (e) {
    printError(e.message);
  }
};

const saveCity = async (city) => {
  if (!city.length) {
    printError('Город не передан');
    return;
  }
  try {
    await saveKeyValue(TOKEN_DICTIONARY.city, city);
    printSuccess('Город сохранен успешно');
  } catch (e) {
    printError(e.message);
  }
};

const getForcast = async () => {
  try {
    const city = process.env.CITY ?? (await getKeyValue(TOKEN_DICTIONARY.city));
    const [coordinates] = await getCoordinates(city);
    const weather = await getWeather(coordinates.lat, coordinates.lon);
    printWeather(weather);
  } catch (e) {
    if (e?.response?.status == 404) {
      printError('Неверно указан город');
    } else if (e?.response?.status == 401) {
      printError('Неверно указан токен');
    } else if (e?.response?.status == 400) {
      printError('Неверные координаты');
    } else {
      printError(e.message);
    }
  }
};

const initCLI = () => {
  const args = getArgs(process.argv);

  if (args.h) {
    return printHelp();
  }

  if (args.c) {
    return saveCity(args.c);
  }

  if (args.t) {
    return saveToken(args.t);
  }

  return getForcast();
};

initCLI();
