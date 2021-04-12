import * as messages from '@shared/messages';
import { active } from '@shared/storage';
import { contractsRef } from '@shared/firebase';

const updateActiveContracts = (snapshot) => {
  return active.set({
    contracts: snapshot.val(),
  });
};

const onMarketEnter = async ([{ marketId }]) => {
  contractsRef
    .orderByChild('market')
    .equalTo(marketId)
    .once('value')
    .then((snapshot) => snapshot.val())
    .then((contracts) => active.set({ contracts }));

  contractsRef
    .orderByChild('market')
    .equalTo(marketId)
    .on('child_changed', updateActiveContracts);
};

const onMarketExit = async () => {
  await active.remove('contracts');
  contractsRef.off('child_changed', updateActiveContracts);
};

try {
  messages.marketEnterStream.subscribe(onMarketEnter);
  messages.marketExitStream.subscribe(onMarketExit);
} catch (error) {
  console.error('error', error);
}
