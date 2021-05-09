import firebase from 'firebase/app';
import 'firebase/database';
import { bright, italic, parse } from 'ansicolor';

import * as log from '@shared/log';
import * as storage from '@shared/storage';

import {
  ONE_HOUR,
  MARKETS_GET,
  MARKET_GET,
  MARKET_CONTRACTS_GET,
  MARKET_PRICES_GET,
  MARKET_PRICES_SUBSCRIBE,
  MARKET_PRICES_UNSUBSCRIBE,
  CONTRACTS_GET,
  TIMESPANS_SUBSCRIBE,
  TIMESPANS_UNSUBSCRIBE,
} from '@shared/const';

const config = {
  apiKey: 'AIzaSyCsS6Um6Op2Ps6H8fuoWklX1WMB5-hUhq4',
  authDomain: 'pav2tty5lo7geycf.firebaseapp.com',
  projectId: 'pav2tty5lo7geycf',
  storageBucket: 'pav2tty5lo7geycf.appspot.com',
  messagingSenderId: '469624002805',
  appId: '1:469624002805:web:561bd21a3d6e50acce4dbc',
};

firebase.initializeApp({
  ...config,
  databaseURL: 'https://pav2tty5lo7geycf-default-rtdb.firebaseio.com',
});

firebase.initializeApp(
  { ...config, databaseURL: 'https://pav2tty5lo7geycf-markets.firebaseio.com' },
  'markets'
);

// prettier-ignore
firebase.initializeApp(
  { ...config, databaseURL: 'https://pav2tty5lo7geycf-contracts.firebaseio.com' },
  'contracts'
);

// prettier-ignore
firebase.initializeApp(
  { ...config, databaseURL: 'https://pav2tty5lo7geycf-prices.firebaseio.com' },
  'prices'
);

// prettier-ignore
firebase.initializeApp(
  { ...config, databaseURL: 'https://pav2tty5lo7geycf-order-books.firebaseio.com' },
  'order-books'
);

// prettier-ignore
firebase.initializeApp(
  { ...config, databaseURL: 'https://pav2tty5lo7geycf-timespans.firebaseio.com' },
  'timespans'
);

const backoffMessage = (database, lastRan) => {
  const name = bright.white.bgBlack(` ${database} `);
  const body = italic(`data fetched recently, returning cache.`);
  const timeLeft = `(${lastRan.remainingSeconds} seconds remaining)`;
  const message = parse(`🚨 ${name} ${body} ${timeLeft}`);

  console.log(...message.asChromeConsoleLogArguments);
};

// Get
const getAllMarkets = async () => {
  const current = await storage.markets.get();
  const lastRan = await storage.getLastRan(MARKETS_GET);
  const missingData = Object.keys(current).length === 0;

  if (!missingData && lastRan.fresh) {
    backoffMessage('markets', lastRan);
    return current;
  }

  return firebase
    .app('markets')
    .database()
    .ref()
    .once('value')
    .then((snapshot) => snapshot.val())
    .then(log.event.firebase(MARKETS_GET))
    .then(storage.setLastRan(MARKETS_GET, ONE_HOUR * 4));
};

const getAllContracts = async () => {
  const current = await storage.contracts.get();
  const lastRan = await storage.getLastRan(CONTRACTS_GET);
  const missingData = Object.keys(current).length === 0;

  if (!missingData && lastRan.fresh) {
    backoffMessage('contracts', lastRan);
    return current;
  }

  return firebase
    .app('contracts')
    .database()
    .ref()
    .once('value')
    .then((snapshot) => snapshot.val())
    .then(log.event.firebase(CONTRACTS_GET))
    .then(storage.setLastRan(CONTRACTS_GET, ONE_HOUR * 4));
};

const getMarket = (id) => {
  return firebase
    .app('markets')
    .database()
    .ref()
    .child(id)
    .once('value')
    .then((snapshot) => snapshot.val())
    .then((snapshot) => ({ [id]: snapshot }))
    .then(log.event.firebase(MARKET_GET))
    .then(storage.setLastRan(MARKET_GET))
    .then(({ [id]: market }) => market);
};

const getMarketContracts = (id) => {
  return firebase
    .app('contracts')
    .database()
    .ref()
    .orderByChild('market')
    .equalTo(id)
    .once('value')
    .then((snapshot) => snapshot.val())
    .then(log.event.firebase(MARKET_CONTRACTS_GET))
    .then(storage.setLastRan(MARKET_CONTRACTS_GET));
};

const getMarketPrices = (id) => {
  return firebase
    .app('prices')
    .database()
    .ref()
    .orderByChild('market')
    .equalTo(id)
    .once('value')
    .then((snapshot) => snapshot.val())
    .then(log.event.firebase(MARKET_PRICES_GET))
    .then(storage.setLastRan(MARKET_PRICES_GET));
};

const subscribeToMarketPriceUpdates = (id, handler) => {
  firebase
    .app('prices')
    .database()
    .ref()
    .orderByChild('market')
    .equalTo(id)
    .on('value', handler);

  log.event.firebase(MARKET_PRICES_SUBSCRIBE)({ id });
  storage.setLastRan(MARKET_PRICES_SUBSCRIBE)();
};

const subscribeToTimespanUpdates = async (handler) => {
  const current = await storage.timespans.get();
  const lastRan = await storage.getLastRan(TIMESPANS_SUBSCRIBE);
  const missingData = Object.keys(current).length === 0;

  if (!missingData && lastRan.fresh) {
    backoffMessage('timespans', lastRan);
    return current;
  }

  const timespansRef = firebase.app('timespans').database().ref();

  timespansRef.off('value');
  timespansRef.on('value', handler);

  log.event.firebase(TIMESPANS_SUBSCRIBE)();
  storage.setLastRan(TIMESPANS_SUBSCRIBE, ONE_HOUR)();
};

const unsubscribeToMarketPriceUpdates = async (id, handler) => {
  firebase
    .app('prices')
    .database()
    .ref()
    .orderByChild('market')
    .equalTo(id)
    .off('value', handler);

  log.event.firebase(MARKET_PRICES_UNSUBSCRIBE)({ id });
  storage.setLastRan(MARKET_PRICES_UNSUBSCRIBE)();
};

const unsubscribeToTimespanUpdates = (handler) => {
  firebase.app('timespans').database().ref().off('value', handler);

  log.event.firebase(TIMESPANS_UNSUBSCRIBE)();
  storage.setLastRan(TIMESPANS_UNSUBSCRIBE)();
};

export const markets = {
  get: getAllMarkets,
};

export const market = {
  get: getMarket,
  subscribe: subscribeToMarketPriceUpdates,
  unsubscribe: unsubscribeToMarketPriceUpdates,
  contracts: {
    get: getMarketContracts,
  },
  prices: {
    get: getMarketPrices,
    subscribe: subscribeToMarketPriceUpdates,
    unsubscribe: unsubscribeToMarketPriceUpdates,
  },
};

export const contracts = {
  get: getAllContracts,
};

export const prices = {
  subscribe: (id, handler) => subscribeToMarketPriceUpdates(id)(handler),
  unsubscribe: (id, handler) => unsubscribeToMarketPriceUpdates(id)(handler),
};

export const timespans = {
  subscribe: subscribeToTimespanUpdates,
  unsubscribe: unsubscribeToTimespanUpdates,
};
