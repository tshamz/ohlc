import { storage, getBucket } from '@extend-chrome/storage';

export const sync = storage.sync;
export const local = storage.local;

export const active = getBucket('active');
export const lastRan = getBucket('lastRan');
export const observers = getBucket('observers');
export const subscriptions = getBucket('subscriptions');

export const markets = getBucket('markets');
export const contracts = getBucket('contracts');
export const prices = getBucket('prices');
export const timespans = getBucket('timespans');
export const watchlist = getBucket('watchlist');

export const getMarket = async (id) => {
  return markets.get(({ [id]: market }) => market);
};

export const setLastRan = (id, expires = Infinity) => async (data) => {
  await lastRan.set({
    [id]: { timestamp: Date.now(), expires: Date.now() + expires },
  });

  return data;
};

export const getLastRan = async (id) => {
  const result = await lastRan.get(({ [id]: lastRan }) => lastRan);

  if (!result) return {};

  const expires = result.expires;
  const remaining = expires - Date.now();
  const remainingSeconds = remaining / 1000;
  const expired = Date.now() > expires;
  const fresh = !expired;

  return { expires, remaining, remainingSeconds, expired, fresh };
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
// lastRan.changeStream.subscribe(logChange('from firebase'));

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
