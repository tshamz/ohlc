import { keyBy, groupBy, mapValues } from 'lodash';

import { setPrice, setPrices } from '@shared/storage';
import { fetchPathOnce, subscribeToPriceUpdates } from '@shared/firebase';

(async () => {
  try {
    const keyByContract = (contracts) => keyBy(contracts, 'id');
    const groupByMarket = (prices) => groupBy(prices, 'market');

    const groupByMarketAndContract = (prices) =>
      mapValues(groupByMarket(prices), keyByContract);

    await fetchPathOnce(`prices`)
      .then(groupByMarketAndContract)
      .then(setPrices);

    const onPriceChange = (snapshot) => {
      return setPrice(snapshot.val());
    };

    subscribeToPriceUpdates(onPriceChange);
  } catch (error) {
    console.error(error);
  }
})();

// await fetchPathOnce(`prices`).then(setPrices);

// const onPriceChange = (snapshot) => {
//   return setPrice(snapshot.val());
// };

// subscribeToPriceUpdates(onPriceChange);
