import * as messages from '@shared/messages';
import { active } from '@shared/storage';
import { pricesRef } from '@shared/firebase';

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
