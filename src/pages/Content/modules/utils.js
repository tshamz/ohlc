import { get } from 'lodash';

export const getMarketIdFromPath = (path) =>
  path.replace(/.*\/detail\/(\d\d\d\d\d?)\/?.*/, '$1');

export const pause = (ms = 5000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const timeLeft = (expiration = 0) =>
  new Date(expiration - Date.now()).toISOString().substr(11, 8);

export const isExpired = (item) => {
  if (!item._expires || typeof item._expires !== 'number') {
    return true;
  }

  return Date.now() > item?._expires;
};

export const toStorage = async (key, update) => {
  return new Promise(async (resolve) => {
    const cache = await fromStorage(key);

    chrome.storage.local.set({ [key]: { ...cache, ...update } }, resolve);
  });
};

export const fromStorage = (keys) => {
  return new Promise((resolve) => {
    const parts = keys.split && keys.split('.');

    if (parts.length > 1) {
      chrome.storage.local.get(parts, (data) => resolve(get(data, keys)));
    } else {
      chrome.storage.local.get(keys, resolve);
    }
  });
};

export const expires = {
  get minute() {
    return Date.now() + 1000 * 60;
  },
  get tenMinutes() {
    return Date.now() + 1000 * 60 * 10;
  },
  get hour() {
    return Date.now() + 1000 * 60 * 60;
  },
  get day() {
    return Date.now() + 1000 * 60 * 60 * 24;
  },
  get week() {
    return Date.now() + 1000 * 60 * 60 * 24 * 7;
  },
  get month() {
    return Date.now() + 1000 * 60 * 60 * 24 * 30;
  },
};

export const dom = {
  get appRoot() {
    return document.querySelector(`.app-layout__content`);
  },

  get ohlcContainers() {
    return document.querySelectorAll('.ohlc-root');
  },

  get contractsContainer() {
    return document.querySelector('.market-detail__contracts');
  },

  get contracts() {
    return document.querySelectorAll(`.market-contract-horizontal-v2`);
  },

  get contractRows() {
    return document.querySelectorAll(`.market-contract-horizontal-v2__row`);
  },

  get showMoreToggle() {
    return document.querySelector(`.market-detail__contracts-toggle-more`);
  },
};
