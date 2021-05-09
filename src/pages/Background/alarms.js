// import * as storage from '@shared/storage';
// import * as firebase from '@shared/firebase';

// try {
//   // const periodInMinutes = 1;
//   // const delayInMinutes = 0;
//   const delayInMinutes = 60;
//   const periodInMinutes = 60 * 4;

//   const cacheData = (bucket) => async (data) => {
//     await bucket.clear();
//     await bucket.set(data);
//   };

//   const cacheMarkets = cacheData(storage.markets);
//   const cacheContracts = cacheData(storage.contracts);

//   chrome.alarms.create('data.cache', { delayInMinutes, periodInMinutes });

//   chrome.alarms.onAlarm.addListener((alarm) => {
//     if (alarm.name === 'data.cache') {
//       firebase.markets.get().then(cacheMarkets);
//       firebase.contracts.get().then(cacheContracts);
//     }
//   });
// } catch (error) {
//   console.error(error);
// }

// // const OPEN = 5;
// // const CLOSE = 23;
// // const timeZone = 'America/Los_Angeles';
// // const isActive = now > OPEN && now < CLOSE;
// // const timeOptions = { timeZone, hour12: false, hour: 'numeric' };
// // const now = new Date().toLocaleTimeString('en-US', timeOptions);
