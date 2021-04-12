import { markets, contracts } from '@shared/storage';
import { marketsRef, contractsRef } from '@shared/firebase';
import {
  MARKETS_UPDATE_INTERVAL,
  CONTRACTS_UPDATED_INTERVAL,
} from '@shared/constants';

try {
  const interval = 12; // hours
  const logStyles = `font-weight:bold;font-style:italic;`;
  const alarmOptions = { delayInMinutes: 60, periodInMinutes: 60 * interval };
  const alarmMap = {
    [MARKETS_UPDATE_INTERVAL]: { ref: marketsRef, bucket: markets },
    [CONTRACTS_UPDATED_INTERVAL]: { ref: contractsRef, bucket: contracts },
  };

  chrome.alarms.create(MARKETS_UPDATE_INTERVAL, alarmOptions);
  chrome.alarms.create(CONTRACTS_UPDATED_INTERVAL, alarmOptions);

  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (!(alarm.name in alarmMap)) return;

    const { ref, bucket } = alarmMap[alarm.name];
    const snapshot = await ref.once('value');
    const count = snapshot.numChildren();
    const data = snapshot.val();
    await bucket.clear();
    await bucket.set(data);

    console.log(`%cAdded ${count} nodes from ${snapshot.key}.`, logStyles);
  });
} catch (error) {
  console.error('error', error);
}

// const OPEN = 5;
// const CLOSE = 23;
// const timeZone = 'America/Los_Angeles';
// const isActive = now > OPEN && now < CLOSE;
// const timeOptions = { timeZone, hour12: false, hour: 'numeric' };
// const now = new Date().toLocaleTimeString('en-US', timeOptions);
