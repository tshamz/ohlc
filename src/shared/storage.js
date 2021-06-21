import min from 'lodash/min';

import * as log from '@shared/log';

import { storage, getBucket } from '@extend-chrome/storage';

import * as firebase from '@shared/firebase';

import {
  ONE_HOUR,
  ONE_MINUTE,
  MARKET_GET,
  MARKET_CONTRACTS_GET,
  MARKET_PRICES_GET,
} from '@shared/const';

export const sync = storage.sync;
export const local = storage.local;

export const cache = getBucket('cache');
export const active = getBucket('active');
export const observers = getBucket('observers');
export const subscriptions = getBucket('subscriptions');

export const markets = getBucket('markets');
export const contracts = getBucket('contracts');
export const prices = getBucket('prices');
export const timespans = getBucket('timespans');
export const watchlist = getBucket('watchlist');

export const getKeys = (event, ids) => {
  return [ids].flat().map((id) => `${event}.${id}`);
};

export const setCache = (keys, expiresIn = 0) => {
  const expiresAt = Date.now() + expiresIn;
  const pairs = [keys].flat().map((key) => [key, expiresAt]);

  return cache.set(Object.fromEntries(pairs));
};

export const getCacheStatus = async (keys) => {
  const expires = Object.values(await cache.get(keys));
  const missing = expires.length === 0;
  const expired = missing || expires.some((value) => !(Date.now() < value));
  const remainingSeconds = min(expires.map((x) => (x - Date.now()) / 100)) || 0;

  return { expired, remainingSeconds };
};

export const getMarket = async (id) => {
  try {
    const key = getKeys(MARKET_GET, id);
    const cache = await getCacheStatus(key);

    if (cache.expired) {
      await firebase
        .getMarket(id)
        .then((market) => ({ [id]: market }))
        .then((market) => markets.set(market))
        .then(() => setCache(key, ONE_HOUR * 4));
    } else {
      log.backoff('market', cache.remainingSeconds);
    }

    return markets.get((markets) => markets[id]);
  } catch (error) {
    console.error(error);
  }
};

export const getMarketContracts = async (market) => {
  try {
    const keys = getKeys(MARKET_CONTRACTS_GET, market.contracts);
    const cache = await getCacheStatus(keys);

    if (cache.expired) {
      await firebase
        .getMarketContracts(market.id)
        .then(contracts.set)
        .then(() => setCache(keys, ONE_HOUR * 4));
    } else {
      log.backoff('market.contracts', cache.remainingSeconds);
    }

    return contracts.get(market.contracts);
  } catch (error) {
    console.error(error);
  }
};

export const getMarketPrices = async (market) => {
  const keys = getKeys(MARKET_PRICES_GET, market.contracts);
  const cache = await getCacheStatus(keys);

  if (cache.expired) {
    await firebase
      .getMarketPrices(market.id)
      .then(prices.set)
      .then(() => setCache(keys, ONE_MINUTE * 10));
  } else {
    log.backoff('market.prices', cache.remainingSeconds);
  }

  return prices.get(market.contracts);
};

export const getMarketTimespans = async (market) => {
  const cache = await getCacheStatus('timespans');

  if (cache.expired) {
    await cacheTimespans();

    setCache('timespans', ONE_HOUR);
  } else {
    log.backoff('timespans', cache.remainingSeconds);
  }

  return timespans.get(market.contracts);
};

export const cacheMarkets = async () => {
  const data = await firebase.getMarkets();
  await markets.clear();
  await markets.set(data);
  return data;
};

export const cacheContracts = async () => {
  const data = await firebase.getContracts();
  await contracts.clear();
  await contracts.set(data);
  return data;
};

export const cacheTimespans = async () => {
  const data = await firebase.getTimespans();
  await timespans.clear();
  await timespans.set(data);
  return data;
};

// import diffler from 'diffler';
// import ansicolor, { parse } from 'ansicolor';

// import * as firebase from '@shared/firebase';

// import * as log from '@shared/log';

// export const logUrl = async (url) => {
//   const prefix = ansicolor.bright(new Date().toLocaleString().padEnd(25));
//   const body = ansicolor.bright.white.bgLightRed(` requesting url: `);
//   const data = ansicolor.bright(url);
//   const message = `${prefix}${body} ${data}`;
//   console.log(...ansicolor.parse(message).asChromeConsoleLogArguments);
//   return url;
// };

// const logChange = (labelText, color = 'red') => (changes) => {};

// active.changeStream.subscribe(logChange('Active'));
// cache.changeStream.subscribe(logChange('from firebase'));

// markets.changeStream.subscribe(logChange('markets', 'green'));
// contracts.changeStream.subscribe(logChange('contracts', 'yellow'));
// prices.changeStream.subscribe(logChange('Prices'));
// timespans.changeStream.subscribe(logChange('Timespans'));
// watchlist.changeStream.subscribe(logChange('Watchlist'));

// const getChange = (oldValue, newValue) => {
//   const changes = diffler(oldValue, newValue);
//   const hasChanges = Object.keys(changes).length > 0;

//   if (!hasChanges) return;

//   return Object.entries(changes).reduce((result, [key, change]) => {
//     const direction =
//       change.to - change.from > 0
//         ? `⬆`
//         : change.to - change.from < 0
//         ? `⬇`
//         : '';

//     return { ...result, [key]: { ...change, direction } };
//   });
// };

// active.changeStream.subscribe(({ market, prices }) => {
//   const hasMarketChange = market?.oldValue && market?.newValue;
//   const hasPricesChange = prices?.oldValue && prices?.newValue;

//   if (!hasMarketChange && !hasPricesChange) return;

//   if (hasMarketChange) {
//     const change = getChange(market?.oldValue, market?.newValue);

//     if (!change) return;

//     console.groupCollapsed(`Active Change - Market`);
//     console.table(change);
//     console.groupEnd();
//   }

//   if (hasPricesChange) {
//     const changes = Object.keys(prices.oldValue)
//       .filter((id) => prices.oldValue[id] && prices.newValue[id])
//       .map((id) => getChange(prices.oldValue[id], prices.newValue[id]))
//       .filter((change) => change);
//     // .map((id) => [getChange(prices.oldValue[id], prices.newValue[id]), id])
//     // .filter(([change]) => change);

//     if (changes.length === 0) return;

//     console.groupCollapsed(`Active Change - Prices`);
//     changes.forEach(([change, id]) => {
//       console.groupCollapsed(id);
//       console.table(change);
//       console.groupEnd();
//     });
//     console.groupEnd();
//   }
// });

// if (changes.prices) {
//   // console.log('change:prices', changes.prices);
// }
// const current = await active.get();
// console.group(`change:active`);
// if (changes.market?.oldValue && current.market) {
//   const difference = diffler(changes.market?.oldValue, current.market);
//   console.groupCollapsed('market');
//   console.table(difference);
//   console.groupEnd();
// }
// Object.values(changes.contracts?.oldValue).map(async(change) => {
//   const contract = await contracts.get(change.id);
//   return
//   {
//     title: `${change.id} - ${current.contracts[change.id].shortName}`
//   }
// })
// if (changes.contracts?.oldValue && current.contracts) {
//   console.groupCollapsed('contracts');
//   Object.values(changes.contracts?.oldValue).forEach((change) => {
//     console.groupCollapsed(`${change.id} - ${change.shortName}`);
//     console.table(diffler(change, current.contracts[change.id]));
//     console.groupEnd();
//   });
//   console.groupEnd();
// }
// if (changes.prices?.oldValue && current.prices) {
//   console.groupCollapsed('prices');
//   Object.values(changes.prices?.oldValue).forEach((change) => {
//     current.prices[change.id]
//     console.groupCollapsed(
//       `${change.id} - ${current.contracts[change.id].shortName}`
//     );
//     console.log('current.prices[change.id]', );
//     console.table(diffler(change, current.prices[change.id]));
//     console.groupEnd();
//   });
//   console.groupEnd();
// }
// console.groupEnd();
// console.log('allChanges', allChanges);
// const hasOldAndNew = (change) => change.oldValue && change.newValue;
// if (!Object.values(allChanges).every(hasOldAndNew)) return;
// setTimeout(async () => {
//   const { market, contracts } = await active.get();
//   const marketMeta = `- ${market?.shortName} (${market?.id})`;
//   console.groupCollapsed(`change:active ${market ? marketMeta : ''}`);
//   Object.entries(allChanges).forEach(([key, changes]) => {
//     console.log('changes', changes);
//     const { oldValue, newValue } = changes;
//     const first = Object.values(changes)[0];
//     // if (!oldValue || !newValue) return;
//     if (key === 'market') {
//       console.groupCollapsed(key);
//       console.table(diffler(oldValue || {}, newValue || {}));
//       console.groupEnd();
//     } else {
//       console.groupCollapsed(key);
//       Object.entries(first).forEach(([id, value]) => {
//         console.log('value', value);
//         console.groupCollapsed(`${id} - ${contracts[id].shortName}`);
//         console.table(diffler(oldValue?.[id] || {}, newValue?.[id] || {}));
//         console.groupEnd();
//       });
//       console.groupEnd();
//     }
//   });
//   console.groupEnd();
// }, 2000);
