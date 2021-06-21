import firebase from 'firebase/app';
import 'firebase/database';

import * as log from '@shared/log';

const config = {
  apiKey: 'AIzaSyCsS6Um6Op2Ps6H8fuoWklX1WMB5-hUhq4',
  authDomain: 'pav2tty5lo7geycf.firebaseapp.com',
  projectId: 'pav2tty5lo7geycf',
  storageBucket: 'pav2tty5lo7geycf.appspot.com',
  messagingSenderId: '469624002805',
  appId: '1:469624002805:web:561bd21a3d6e50acce4dbc',
};

/* Apps */
const app = firebase.initializeApp({
  ...config,
  databaseURL: 'https://pav2tty5lo7geycf-default-rtdb.firebaseio.com',
});

const markets = firebase.initializeApp(
  { ...config, databaseURL: 'https://pav2tty5lo7geycf-markets.firebaseio.com' },
  'markets'
);

const contracts = firebase.initializeApp(
  {
    ...config,
    databaseURL: 'https://pav2tty5lo7geycf-contracts.firebaseio.com',
  },
  'contracts'
);

const prices = firebase.initializeApp(
  { ...config, databaseURL: 'https://pav2tty5lo7geycf-prices.firebaseio.com' },
  'prices'
);

const orderBooks = firebase.initializeApp(
  {
    ...config,
    databaseURL: 'https://pav2tty5lo7geycf-order-books.firebaseio.com',
  },
  'order-books'
);

const timespans = firebase.initializeApp(
  {
    ...config,
    databaseURL: 'https://pav2tty5lo7geycf-timespans.firebaseio.com',
  },
  'timespans'
);

const appRef = app.database().ref();
const marketsRef = markets.database().ref();
const contractsRef = contracts.database().ref();
const pricesRef = prices.database().ref();
const orderBooksRef = orderBooks.database().ref();
const timespansRef = timespans.database().ref();
const marketPricsRef = (id) => pricesRef.orderByChild('market').equalTo(id);
const marketContractsRef = (id) =>
  contractsRef.orderByChild('market').equalTo(id);

const getOnce = async (refOrQuery) => {
  const ref = refOrQuery.ref;
  const snapshot = await ref.once('value');
  const data = await snapshot.val();
  const query = ref.queryObject();
  const database = snapshot.ref.database.app.name;
  const event = Object.keys(query).length
    ? `${query.i}.${database}.get`
    : `${database}.get`;

  log.firebase(event, data);

  return data;
};

const subscribeTo = (refOrQuery, handler) => {
  const ref = refOrQuery.ref;
  const query = refOrQuery.queryObject();
  const database = ref.database.app.name;
  const event = Object.keys(query).length
    ? `${query.i}.${database}.subscribe`
    : `${database}.subscribe`;

  log.firebase(event, { ref, query, database });

  ref.on('value', handler);
};

const unsubscribeFrom = (refOrQuery, handler) => {
  const ref = refOrQuery.ref;
  const query = refOrQuery.queryObject();
  const database = ref.database.app.name;
  const event = Object.keys(query).length
    ? `${query.i}.${database}.unsubscribe`
    : `${database}.unsubscribe`;

  log.firebase(event, { ref, query, database });

  ref.off('value', handler);
};

/* Get */
export const getMarkets = () => getOnce(marketsRef);
export const getContracts = () => getOnce(contractsRef);
export const getTimespans = () => getOnce(timespansRef);
export const getMarket = (id) => getOnce(marketsRef.child(id));
export const getMarketPrices = (id) => getOnce(marketPricsRef(id));
export const getMarketContracts = (id) => getOnce(marketContractsRef(id));

/* Subscribe */
export const subscribeToTimespanUpdates = (handler) =>
  subscribeTo(timespansRef, handler);

export const unsubscribeToTimespanUpdates = (handler) =>
  unsubscribeFrom(timespansRef, handler);

export const subscribeToMarketPriceUpdates = (id, handler) =>
  subscribeTo(marketPricsRef(id), handler);

export const unsubscribeToMarketPriceUpdates = (id, handler) =>
  unsubscribeFrom(marketPricsRef(id), handler);

// if (!missingData && lastRan.fresh) {
//   backoffMessage('contracts', lastRan);
//   return current;
// }
// if (!missingData && lastRan.fresh) {
//   backoffMessage('timespans', lastRan);
//   return current;
// }

// if (!missingData && lastRan.fresh) {
//   backoffMessage('timespans', lastRan);
//   return current;
// }
