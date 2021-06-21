import * as log from '@shared/log';
import * as storage from '@shared/storage';
import * as firebase from '@shared/firebase';

(async () => {
  try {
    const cache = await storage.getCacheStatus('timespans');

    const onTimespanUpdate = async (snapshot) => {
      const data = await snapshot.val();

      storage.timespans.set(data);
    };

    if (cache.expired) {
      firebase.subscribeToTimespanUpdates(onTimespanUpdate);
    } else {
      log.backoff('timespans', cache.remainingSeconds);
    }
  } catch (error) {
    console.error(error);
  }
})();
