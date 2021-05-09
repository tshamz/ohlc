import * as storage from '@shared/storage';
import * as firebase from '@shared/firebase';

// import { TIMESPANS_SUBSCRIBE } from '@shared/const';

(async () => {
  try {
    const onValue = (snapshot) => storage.timespans.set(snapshot.val());

    firebase.timespans.subscribe(onValue);

    // const delayInMinutes = 0;
    // const periodInMinutes = 60;

    // chrome.alarms.create(TIMESPANS_SUBSCRIBE, alarmOptions);

    // chrome.alarms.onAlarm.addListener(async (alarm) => {
    //   if (alarm.name === TIMESPANS_SUBSCRIBE) {

    //   }
    // });
  } catch (error) {
    console.error(error);
  }
})();
