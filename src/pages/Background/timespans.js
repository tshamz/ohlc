import { mapValues } from 'lodash';

import { setTimespans } from '@shared/storage';
import { calculatePrices } from '@shared/prices';
import { subscribeToTimespanUpdates } from '@shared/firebase';

(async () => {
  try {
    const mapPrices = (contracts) => {
      return mapValues(contracts, calculatePrices);
    };

    const onTimespansChange = (snapshot) => {
      const update = mapValues(snapshot.val(), mapPrices);
      setTimespans(update);
      return update;
    };

    subscribeToTimespanUpdates(onTimespansChange);
  } catch (error) {
    console.error(error);
  }
})();
