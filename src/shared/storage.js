import { keyBy } from 'lodash';
import { getBucket } from '@extend-chrome/storage';

const getOne = (bucket) => {
  return (key) => bucket.get(key.toString()).then((data) => data[key] || {});
};

const setOne = (bucket) => {
  return (update) => bucket.set({ [update.id]: update });
};

const getAll = (bucket) => {
  return () => bucket.get();
};

const setMany = (bucket) => {
  return (updates) =>
    Array.isArray(updates)
      ? bucket.set(keyBy(updates, 'id'))
      : bucket.set(updates);
};

export const marketsBucket = getBucket('markets');
export const getMarket = getOne(marketsBucket);
export const setMarket = setOne(marketsBucket);
export const getMarkets = getAll(marketsBucket);
export const setMarkets = setMany(marketsBucket);
export const marketChanges = marketsBucket.changeStream;

export const positionsBucket = getBucket('positions');
export const getPosition = getOne(positionsBucket);
export const setPosition = setOne(positionsBucket);
export const getPositions = getAll(positionsBucket);
export const setPositions = setMany(positionsBucket);
export const positionChanges = positionsBucket.changeStream;

export const pricesBucket = getBucket('prices');
export const getPrice = getOne(pricesBucket);
// export const setPrice = setOne(pricesBucket);
export const getPrices = getAll(pricesBucket);
export const setPrices = setMany(pricesBucket);
export const priceChanges = pricesBucket.changeStream;

export const timespansBucket = getBucket('timespans');
export const getTimespan = getOne(timespansBucket);
export const setTimespan = setOne(timespansBucket);
export const getTimespans = getAll(timespansBucket);
export const setTimespans = setMany(timespansBucket);
export const timespanChanges = timespansBucket.changeStream;

export const setPrice = (update) => {
  const market = update.market;
  const contract = update.id;
  const marketContractPrices = getPrice(market);

  setPrices({
    [market]: {
      ...marketContractPrices,
      [contract]: update,
    },
  });
};

export const buckets = {
  markets: marketsBucket,
  positions: positionsBucket,
  prices: pricesBucket,
  timespans: timespansBucket,
};

export const changes = {
  markets: marketChanges,
  positions: positionChanges,
  prices: priceChanges,
  timespans: timespanChanges,
};
