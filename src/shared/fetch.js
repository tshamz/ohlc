import fakeUserAgent from 'fake-useragent';

import { logUrl, remapKeys } from '@shared/utils';
import { PREDICTIT_DOT_ORG } from '@shared/constants';
import { contractsRef, getMarketRef } from '@shared/firebase';
import { markets, contracts, prices } from '@shared/storage';

const fetchPredictitMarket = async (marketId) => {
  const url = `${PREDICTIT_DOT_ORG}/api/marketdata/markets/${marketId}`;
  const headers = { 'User-Agent': fakeUserAgent() };

  const response = await logUrl(url)
    .then((url) => fetch(url, { headers }))
    .then((response) => response.json());

  const update = {
    ...response,
    id: response.id.toString(),
    active: response.status === 'Open',
    dateEnd: false,
    daysLeft: false,
    totalSharesTraded: false,
  };

  delete update.status;
  delete update.timeStamp;

  return update;
};

export const fetchMarketFromPredictit = async (marketId) => {
  const market = await fetchPredictitMarket(marketId);
  const update = {
    [market.id]: {
      ...market,
      contracts: market.contracts.map(({ id }) => `${id}`),
    },
  };

  return markets.set(update).then(() => update[market.id]);
};

export const fetchContractsFromPredictit = async (marketId) => {
  const market = await fetchPredictitMarket(marketId);
  const update = market.contracts
    .map(remapKeys)
    .map((contract) => ({ ...contract, id: `${contract.id}` }))
    .map((contract) => ({ ...contract, market: `${marketId}` }))
    .map((contract, index) => ({ ...contract, displayOrder: index }))
    .map((contract) => {
      delete contract.dateEnd;
      delete contract.status;
      delete contract.buyNo;
      delete contract.buyYes;
      delete contract.lastClose;
      delete contract.lastTrade;
      delete contract.sellNo;
      delete contract.sellYes;
      return contract;
    })
    .reduce((data, contract) => ({ ...data, [contract.id]: contract }), {});

  return contracts.set(update).then(() => update);
};

export const fetchPricesFromPredictit = async (marketId) => {
  const market = await fetchPredictitMarket(marketId);
  const update = market.contracts
    .map(remapKeys)
    .map((contract) => ({ ...contract, id: `${contract.id}` }))
    .map((contract) => ({ ...contract, market: `${marketId}` }))
    .map((contract) => {
      delete contract.dateEnd;
      delete contract.status;
      delete contract.displayOrder;
      delete contract.image;
      delete contract.name;
      delete contract.shortName;
      return contract;
    })
    .reduce((data, contract) => ({ ...data, [contract.id]: contract }), {});

  return prices.set(update).then(() => update);
};

export const fetchMarketFromFirebase = (marketId) => {
  return getMarketRef(marketId)
    .once('value')
    .then((snapshot) => snapshot.val());
};

export const fetchContractsFromFirebase = (marketId) => {
  return contractsRef.orderByChild('market').equalTo(marketId).once('value');
};

// export const fetchMarketData = async (id) => {
//   const [marketData, positionData, timespans] = await Promise.all([
//     // storage.markets.get(id),
//     // storage.positions.get(id),
//     // storage.timespans.get(id),
//   ]);

//   const { contracts, prices, ...market } = marketData;
//   const { contracts: positions = {}, ...marketPosition } = positionData;

//   return {
//     market: {
//       ...market,
//       ...marketPosition,
//     },
//     contracts,
//     positions,
//     prices,
//     timespans,
//   };
//   return {};
// };

// export const fetchPredictitPositions = throttle(async () => {
//   try {
//     const lastRan = await storage.lastRan.get('positions');
//     if (Date.now() - lastRan < POSITIONS_BACKOFF_MS) {
//       // return fetchPredictitPositions();
//       return;
//     }
//     await storage.lastRan.set({ positions: Date.now() });
//     const token = JSON.parse(window.localStorage.getItem('token'))?.value;
//     const headers = { Authorization: `Bearer ${token}` };
//     const response = await logUrl(`${PREDICTIT_DOT_ORG}/api/Profile/Shares`)
//       .then((url) => fetch(url, { headers }))
//       .then((response) => response.json())
//       .catch(console.error);
//     const mapContracts = (id) => (contracts, contract) => {
//       return {
//         ...contracts,
//         [contract.id]: {
//           ...contract,
//           market: id,
//         },
//       };
//     };
//     const mapMarketsAndContracts = (markets, { id, ...market }) => {
//       return {
//         ...markets,
//         [id]: {
//           id,
//           ...market,
//           contracts: market.contracts
//             .map(remapKeys)
//             .reduce(mapContracts(id), {}),
//         },
//       };
//     };
//     if (!response.markets) return;
//     const positions = response.markets
//       .map(remapKeys)
//       .reduce(mapMarketsAndContracts, {});
//     storage.positions.set(positions);
//     return positions;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }, POSITIONS_BACKOFF_MS);
