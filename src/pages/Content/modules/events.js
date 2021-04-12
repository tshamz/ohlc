import * as messages from '@shared/messages';

import log from '@shared/log';
import { active } from '@shared/storage';
// import { fetchPredictitPositions } from '@shared/fetch';
import {
  MARKET_ENTER,
  MARKET_EXIT,
  MARKET_READY,
  POSITION_CHANGE,
} from '@shared/constants';

import {
  mountApp,
  watchForMarketReady,
  watchForAddedOrRemovedNodes,
} from './dom';

const dispatchEvent = (name, detail) => {
  const event = new CustomEvent(name, { detail });
  window.dispatchEvent(event);
};

export const init = async () => {
  log(`extension starting...`.italic.lightGreen);

  await active.clear();

  // fetchPredictitPositions();
  watchForAddedOrRemovedNodes();
};

export const onMarketEnter = async ({ detail: id }) => {
  try {
    log(` market enter `.bright.white.bgLightYellow, id);
    messages.marketEnterSend({ marketId: id });

    await watchForMarketReady();

    dispatchEvent('market.ready', id);
  } catch (error) {
    console.log('error', error);
  }
};

export const onMarketReady = async ({ detail: id }) => {
  try {
    log(` market ready `.bright.white.bgLightGreen, id);
    mountApp();
  } catch (error) {
    console.log('error', error);
  }
};

export const onMarketExit = ({ detail: id }) => {
  try {
    log(` market exit `.bright.white.bgLightRed, id);

    messages.marketExitSend({ marketId: id });
  } catch (error) {
    console.log('error', error);
  }
};

const onMessage = (message) => {
  console.log('message', message);

  if (message.type === 'navigation') {
    dispatchEvent(message.event, message.id);
  }
};

const onPositionChange = ({ detail }) => {
  // fetchPredictitPositions();
  mountApp();
};

chrome.runtime.onMessage.addListener(onMessage);

window.addEventListener(MARKET_ENTER, onMarketEnter);
window.addEventListener(MARKET_EXIT, onMarketExit);
window.addEventListener(MARKET_READY, onMarketReady);
window.addEventListener(POSITION_CHANGE, onPositionChange);
