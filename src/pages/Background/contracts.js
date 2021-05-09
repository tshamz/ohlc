import * as storage from '@shared/storage';
import * as firebase from '@shared/firebase';

import { CACHE_CONTRACTS } from '@shared/const';

(async () => {
  try {
    // const periodInMinutes = 1;
    // const delayInMinutes = 60;
    const delayInMinutes = 0;
    const periodInMinutes = 60 * 4;

    chrome.alarms.create(CACHE_CONTRACTS, { delayInMinutes, periodInMinutes });

    chrome.alarms.onAlarm.addListener(async (alarm) => {
      if (alarm.name === CACHE_CONTRACTS) {
        const contracts = await firebase.contracts.get();
        await storage.contracts.clear();
        await storage.contracts.set(contracts);
      }
    });
  } catch (error) {
    console.error(error);
  }
})();
