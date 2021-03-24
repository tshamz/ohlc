import { throttle } from 'lodash';

import { setMarkets } from '@shared/storage';
import { fetchPathOnce } from '@shared/firebase';
import { logUrl, remapKeys } from '@shared/utils';
import { PREDICTIT_DOT_ORG } from '@shared/constants';

try {
  chrome.alarms.create('fetchMarkets', {
    delayInMinutes: 1.0,
    periodInMinutes: 1.0,
  });

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'fetchMarkets') {
      fetchPredictitData();
    }
  });
} catch (error) {
  console.error(error);
}

const fetchPredictitData = throttle(async () => {
  try {
    const [predictit, firebase] = await Promise.all([
      logUrl(`${PREDICTIT_DOT_ORG}/api/marketdata/all`)
        .then(fetch)
        .then((response) => response.json()),
      fetchPathOnce(`markets`),
    ]);

    const mapPrices = (id) => (prices, contract, index) => {
      return {
        ...prices,
        [contract.id]: {
          id: contract.id,
          market: contract.market,
          shortName: contract.shortName,
          buyNo: contract.buyNo,
          buyYes: contract.buyYes,
          sellNo: contract.sellNo,
          sellYes: contract.sellYes,
          lastClose: contract.lastClose,
          lastTrade: contract.lastTrade,
        },
      };
    };

    const mapContracts = (id) => (contracts, contract, index) => {
      return {
        ...contracts,
        [contract.id]: {
          id: contract.id,
          market: id,
          name: contract.name,
          shortName: contract.shortName,
          displayOrder: index,
          openBuyOrders: contract.openBuyOrders,
          openSellOrders: contract.openSellOrders,
          pricePerShare: contract.pricePerShare,
          quantity: contract.quantity,
        },
      };
    };

    const mapMarketsAndContracts = (markets, { id, ...market }) => {
      return {
        ...markets,
        [id]: {
          ...market,
          ...firebase[id],
          dateEnd: firebase[id].dateEnd
            ? new Date(firebase[id].dateEnd).toLocaleString()
            : null,
          contracts: market.contracts
            .map(remapKeys)
            .reduce(mapContracts(id), {}),
          prices: market.contracts.map(remapKeys).reduce(mapPrices(id), {}),
        },
      };
    };

    const markets = predictit.markets
      .map(remapKeys)
      .reduce(mapMarketsAndContracts, {});

    setMarkets(markets);
  } catch (error) {
    console.error(error);
    throw error;
  }
}, 60000);

// const contracts = predictit.markets
//   .map(({ contracts }) => contracts)
//   .flat()
//   .map(remapKeys)
//   .reduce(mapContracts, {});

// const prices = predictit.markets
//   .map(({ contracts }) => contracts)
//   .flat()
//   .map(remapKeys)
//   .reduce(mapPrices, {});

// const markets = predictit.markets
//   .map(remapKeys)
//   .reduce(mapMarketsAndContracts, {});

// const mapMarkets = (markets, { id, contracts, ...market }) => {
//   return {
//     ...markets,
//     [id]: {
//       ...market,
//       ...firebase[id],
//       dateEnd: firebase[id].dateEnd
//         ? new Date(firebase[id].dateEnd).toLocaleString()
//         : null,
//     },
//   };
// };

// const mapContracts = (contracts, contract, index) => {
//   return {
//     ...contracts,
//     [contract.id]: {
//       id: contract.id,
//       market: contract.market,
//       name: contract.name,
//       shortName: contract.shortName,
//       displayOrder: index,
//       openBuyOrders: contract.openBuyOrders,
//       openSellOrders: contract.openSellOrders,
//       pricePerShare: contract.pricePerShare,
//       quantity: contract.quantity,
//     },
//   };
// };

// const mapPrices = (prices, contract) => {
//   return {
//     ...prices,
//     [contract.id]: {
//       id: contract.id,
//       market: contract.market,
//       shortName: contract.shortName,
//       buyNo: contract.buyNo,
//       buyYes: contract.buyYes,
//       sellNo: contract.sellNo,
//       sellYes: contract.sellYes,
//       lastClose: contract.lastClose,
//       lastTrade: contract.lastTrade,
//     },
//   };
// };
