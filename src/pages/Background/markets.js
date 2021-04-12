import * as messages from '@shared/messages';
import { marketsRef } from '@shared/firebase';
import { active } from '@shared/storage';

const updateActiveMarket = (snapshot) => {
  return active.set({
    market: snapshot.val(),
  });
};

const onMarketEnter = async ([{ marketId }]) => {
  marketsRef
    .orderByChild('id')
    .equalTo(marketId)
    .once('value')
    .then((snapshot) => snapshot.val())
    .then((market) => active.set({ market }));

  marketsRef
    .orderByChild('id')
    .equalTo(marketId)
    .on('child_changed', updateActiveMarket);
};

const onMarketExit = async () => {
  await active.remove('market');
  marketsRef.off('child_changed', updateActiveMarket);
};

try {
  messages.marketEnterStream.subscribe(onMarketEnter);
  messages.marketExitStream.subscribe(onMarketExit);
} catch (error) {
  console.error('error', error);
}
