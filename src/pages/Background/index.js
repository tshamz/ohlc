import firebase from 'firebase/app';
import database from 'firebase/database';

const app = firebase.initializeApp(
  {
    apiKey: 'AIzaSyCsS6Um6Op2Ps6H8fuoWklX1WMB5-hUhq4',
    authDomain: 'pav2tty5lo7geycf.firebaseapp.com',
    databaseURL: 'https://pav2tty5lo7geycf-default-rtdb.firebaseio.com',
    projectId: 'pav2tty5lo7geycf',
    storageBucket: 'pav2tty5lo7geycf.appspot.com',
    messagingSenderId: '469624002805',
    appId: '1:469624002805:web:561bd21a3d6e50acce4dbc',
  },
  'ohlc'
);

chrome.alarms.create('fetchMarkets', {
  delayInMinutes: 1.0,
  periodInMinutes: 60.0,
});

// chrome.alarms.create('fetchPositions', {
//   delayInMinutes: 1.0,
//   periodInMinutes: 30.0,
// });

chrome.runtime.onConnect.addListener(async (...args) => {
  cacheMarkets();
  // cachePositions();
});

chrome.runtime.onMessage.addListener(async ({ type, message }) => {
  console.log('message!', type, message);

  if (type === 'token' && message) {
    chrome.storage.local.set({ token: message });
  }

  if (type === 'token' && !message) {
    chrome.storage.local.remove('token');
  }
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'fetchMarkets') {
    cacheMarkets();
  }

  if (alarm.name === 'fetchPositions') {
    // cachePositions();
  }
});

const cachePositions = async () => {
  try {
    const { token } = await fromStorage('token');
    console.log('token', token);

    if (!token) return;

    const positions = await getPositionsData(token);
    console.log('positions', positions);
    chrome.storage.local.set({ positions });
  } catch (error) {
    console.log('cachePositions error', error);
    chrome.storage.local.remove('token');
    throw error;
  }
};

const cacheMarkets = async () => {
  try {
    const markets = await getMarketData();
    chrome.storage.local.set({ markets });
  } catch (error) {
    console.log('cacheMarkets error', error);
    throw error;
  }
};

const getPositionsData = async (token) => {
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const url = `https://www.predictit.org/api/Profile/Shares`;
    const response = await fetch(url, { headers });
    console.log('response', response);
    const positions = await response.json();
    console.log('positions', positions);

    return positions;
  } catch (error) {
    console.log('getPositionsData error', error);
    throw error;
  }
};

const getMarketData = async () => {
  try {
    const [predictit, firebaseMarkets, firebaseContracts] = await Promise.all([
      fetch(`https://www.predictit.org/api/marketdata/all/`)
        .then((response) => response.json())
        .then((data) => data.markets),
      firebase
        .database(app)
        .ref(`markets`)
        .once('value')
        .then((snapshot) => snapshot.val()),
      firebase
        .database(app)
        .ref(`contracts`)
        .once('value')
        .then((snapshot) => snapshot.val()),
    ]);

    return predictit.reduce((markets, market) => {
      return {
        ...markets,
        [market.id]: {
          ...market,
          ...firebaseMarkets[market.id],
          contracts: market.contracts.map((contract) => ({
            ...contract,
            ...firebaseContracts[contract.id],
          })),
        },
      };
    }, {});
  } catch (error) {
    console.log('getMarketData error', error);
    throw error;
  }
};

const fromStorage = (keys) =>
  new Promise((resolve) => chrome.storage.local.get(keys, resolve));
