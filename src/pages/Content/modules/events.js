import { observableDiff } from 'deep-diff';

import log, { logError } from '@shared/log';
import { fetchPredictitPositions, fetchMarketData } from '@shared/fetch';
import {
  marketsBucket,
  positionsBucket,
  pricesBucket,
  timespansBucket,
  getMarket,
  getMarkets,
} from '@shared/storage';

import {
  mountApp,
  watchForMarketReady,
  watchForAddedOrRemovedNodes,
} from './dom';

const dispatchEvent = (name, detail) => {
  const event = new CustomEvent(name, { detail });
  window.dispatchEvent(event);
};

export const init = () => {
  log(`extension starting...`.italic.lightGreen);

  fetchPredictitPositions();

  const path = window.location.pathname;
  const id = path.match(/detail\/(?<id>\d\d\d\d\d?)/)?.groups.id;

  id && dispatchEvent('market.enter', id);
};

export const onMarketEnter = async ({ detail: id }) => {
  try {
    log(` market enter `.bright.white.bgLightYellow, id);

    const data = await fetchMarketData(id);

    await watchForMarketReady();

    dispatchEvent('market.ready', data);
  } catch (error) {
    logError(error);
  }
};

export const onMarketReady = async ({ detail: data }) => {
  try {
    log(` market ready `.bright.white.bgLightGreen, data.market.id);

    mountApp(data);

    watchForAddedOrRemovedNodes();
  } catch (error) {
    logError(error);
  }
};

export const onMarketExit = ({ detail: id }) => {
  try {
    log(` market exit `.bright.white.bgLightRed, id);
  } catch (error) {
    logError(error);
  }
};

const onMessage = (message) => {
  console.log('message', message);

  if (message.type === 'navigation') {
    dispatchEvent(message.event, message.id);
  }
};

const onContractOwnershipChange = ({ detail }) => {
  fetchPredictitPositions();
};

const onPriceChange = async (changes) => {
  const markets = await getMarkets();
  const options = { prefilter: (path, key) => key[0] === '_' };

  const logDifference = ([contractId, change]) => {
    const market = markets[change.newValue.market];
    if (!market) return;
    const contract = market.contracts[contractId];
    const observer = (difference) => log.price(market, contract, difference);
    observableDiff(change.oldValue, change.newValue, observer, options);
  };

  Object.entries(changes).forEach(logDifference);
};

const onTimespansChange = async () => {
  log(`timespans updated`.bright.lightYellow);
};

const onAccountFunds = ({ detail }) => {};
const onContractData = ({ detail }) => {};
const onMarketOwnershipChange = ({ detail }) => {};
const onTradeConfirmed = ({ detail }) => {};
const onMarketData = ({ detail }) => {};
const onMarketStatus = ({ detail }) => {};
const onSharesTraded = ({ detail }) => {};
const onTradeLevelChanged = ({ detail }) => {};

// prices.changeStream.subscribe(onPriceChange);
timespansBucket.changeStream.subscribe(onTimespansChange);
chrome.runtime.onMessage.addListener(onMessage);
window.addEventListener('market.exit', onMarketExit);
window.addEventListener('market.enter', onMarketEnter);
window.addEventListener('market.ready', onMarketReady);
window.addEventListener('market.data', onMarketData);
window.addEventListener('market.ownership', onMarketOwnershipChange);
window.addEventListener('market.status', onMarketStatus);
window.addEventListener('contract.ownership', onContractOwnershipChange);
window.addEventListener('contract.data', onContractData);
window.addEventListener('accountFunds.data', onAccountFunds);
window.addEventListener('trade.confirmed', onTradeConfirmed);
window.addEventListener('notification.sharesTraded', onSharesTraded);
window.addEventListener('notification.tradeLevelChanged', onTradeLevelChanged);

window._markets = marketsBucket;
window._positions = positionsBucket;
window._prices = pricesBucket;
window._timespans = timespansBucket;
window._getMarket = getMarket;
window._getMarkets = getMarkets;

// chrome.storage.local.onChanged.hasListener(onStorageChange);
// if (!chrome.storage.local.onChanged.hasListener(onStorageChange)) {}
