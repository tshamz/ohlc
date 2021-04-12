import * as messages from '@shared/messages';
import { contractsRef } from '@shared/firebase';
import { markets, active, contracts } from '@shared/storage';

import { fetchContractsFromPredictit as fetchContracts } from '@shared/fetch';

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

// const onMarketEnter = async ([{ marketId }]) => {
//   const contractIds = await markets
//     .get(marketId)
//     .then((result) => result[marketId]?.contracts);

//   const getContracts = contractIds
//     ? contracts.get(contractIds)
//     : fetchContracts(marketId);

//   await getContracts.then((contracts) => active.set({ contracts }));

//   return contractsRef
//     .orderByChild('market')
//     .equalTo(marketId)
//     .on('child_changed', updateActiveContracts);
// };

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
