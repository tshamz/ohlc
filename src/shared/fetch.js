import { throttle } from 'lodash';

import { remapKeys, logUrl } from '@shared/utils';
import { PREDICTIT_DOT_ORG } from '@shared/constants';

import {
  getMarket,
  getTimespan,
  getPosition,
  setPositions,
} from '@shared/storage';

// export const fetchMarketData = async (id) => ({
//   market: await getMarket(id),
//   timespans: await getTimespan(id),
//   positions: await getPosition(id),
// });

export const fetchMarketData = async (id) => {
  const [marketData, positionData, timespans] = await Promise.all([
    getMarket(id),
    getPosition(id),
    getTimespan(id),
  ]);

  const { contracts, prices, ...market } = marketData;
  const { contracts: positions = {}, ...marketPosition } = positionData;

  return {
    market: {
      ...market,
      ...marketPosition,
    },
    contracts,
    positions,
    prices,
    timespans,
  };
};

export const fetchPredictitPositions = throttle(async () => {
  try {
    const token = JSON.parse(window.localStorage.getItem('token'))?.value;
    const headers = { Authorization: `Bearer ${token}` };
    const response = await logUrl(`${PREDICTIT_DOT_ORG}/api/Profile/Shares`)
      .then((url) => fetch(url, { headers }))
      .then((response) => response.json())
      .catch(console.error);

    const mapContracts = (id) => (contracts, contract) => {
      return {
        ...contracts,
        [contract.id]: {
          ...contract,
          market: id,
        },
      };
    };

    const mapMarketsAndContracts = (markets, { id, ...market }) => {
      return {
        ...markets,
        [id]: {
          id,
          ...market,
          contracts: market.contracts
            .map(remapKeys)
            .reduce(mapContracts(id), {}),
        },
      };
    };

    const positions = response.markets
      .map(remapKeys)
      .reduce(mapMarketsAndContracts, {});

    setPositions(positions);

    return positions;
  } catch (error) {
    console.error(error);
    throw error;
  }
}, 30000);
