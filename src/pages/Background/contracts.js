import * as storage from '@shared/storage';

import { CACHE_CONTRACTS } from '@shared/const';

(async () => {
  try {
    // const periodInMinutes = 1;
    // const delayInMinutes = 0;
    const delayInMinutes = 60;
    const periodInMinutes = 60 * 4;
    const alarmOptions = { delayInMinutes, periodInMinutes };

    const onAlarm = async (alarm) =>
      alarm.name === CACHE_CONTRACTS && storage.cacheContracts();

    chrome.alarms.create(CACHE_CONTRACTS, alarmOptions);
    chrome.alarms.onAlarm.addListener(onAlarm);
  } catch (error) {
    console.error(error);
  }
})();
