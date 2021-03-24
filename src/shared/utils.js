import ansicolor from 'ansicolor';

import { KEY_MAP as keyMap } from './constants';

export const pause = (ms = 5000) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const timeLeft = (expiration = 0) => {
  return new Date(expiration - Date.now()).toISOString().substr(11, 8);
};

export const isExpired = (item = {}) => {
  if (!item._expires || typeof item._expires !== 'number') {
    return true;
  }

  return Date.now() > item?._expires;
};

export const toStorage = (key, update) => {
  chrome.storage.local.get(key, (data) => {
    chrome.storage.local.set({ [key]: { ...data[key], ...update } });
  });
  return update;
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

export const $ = {
  get appRoot() {
    return document.querySelector(`.app-layout-old__content`);
  },

  get ohlcAppRoot() {
    return document.getElementById('ohlc-app-root');
  },

  get ohlcContainerRoot() {
    return document.querySelectorAll('.ohlc-container-root');
  },

  get payoutHeader() {
    return document.querySelector('.market-detail__payout-header');
  },

  get payoutHeader_() {
    return document.getElementsByClassName('market-detail__payout-header');
  },

  get marketPayout() {
    return document.querySelector('.market-payout');
  },

  get marketPayout_() {
    return document.getElementsByClassName('market-payout');
  },

  get marketDetail() {
    return document.querySelector('.market-detail');
  },

  get marketDetail_() {
    return document.getElementsByClassName('market-detail');
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
    return document.querySelector(
      `.market-detail__contracts-toggle-more:not(.market-detail__contracts-toggle-more--active)`
    );
  },
};

export const remapKeys = (data) => {
  const mapToNewKey = ([key, value]) => [keyMap[key] || key, value];
  const remappedEntries = Object.entries(data).map(mapToNewKey);
  return Object.fromEntries(remappedEntries);
};

export const logUrl = async (url) => {
  const prefix = ansicolor.bright(new Date().toLocaleString().padEnd(25));
  const body = ansicolor.bright.white.bgLightRed(` requesting url: `);
  const data = ansicolor.bright(url);
  const message = `${prefix}${body} ${data}`;
  console.log(...ansicolor.parse(message).asChromeConsoleLogArguments);
  return url;
};
