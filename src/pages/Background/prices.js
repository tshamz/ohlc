import * as messages from '@shared/messages';
import { pricesRef } from '@shared/firebase';
import { markets, active, prices } from '@shared/storage';

import { fetchPricesFromPredictit as fetchPrices } from '@shared/fetch';

const updateActivePrices = (snapshot) => {
  return active.set({
    prices: snapshot.val(),
  });
};

const onMarketEnter = async ([{ marketId }]) => {
  pricesRef
    .orderByChild('market')
    .equalTo(marketId)
    .once('value')
    .then((snapshot) => snapshot.val())
    .then((prices) => active.set({ prices }));

  pricesRef
    .orderByChild('market')
    .equalTo(marketId)
    .on('child_changed', updateActivePrices);
};

// const onMarketEnter = async ([{ marketId }]) => {
//   const contractIds = await markets
//     .get(marketId)
//     .then((result) => result[marketId]?.contracts || []);
//   console.log('contractIds', contractIds);

//   const fromStorage = await prices.get(contractIds);

//   const getPrices = Object.keys(fromStorage).length
//     ? prices.get(contractIds)
//     : fetchPrices(marketId);

//   await getPrices.then((prices) => active.set({ prices }));

//   return pricesRef
//     .orderByChild('market')
//     .equalTo(marketId)
//     .on('child_changed', updateActivePrices);
// };

const onMarketExit = async () => {
  await active.remove('prices');
  pricesRef.off('child_changed', updateActivePrices);
};

try {
  messages.marketEnterStream.subscribe(onMarketEnter);
  messages.marketExitStream.subscribe(onMarketExit);
} catch (error) {
  console.error('error', error);
}
