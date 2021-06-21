import * as log from '@shared/log';
import * as messages from '@shared/messages';
import * as storage from '@shared/storage';

import {
  renderComponents,
  unmountComponents,
  waitForUIUpdate,
  watchForAddedOrRemovedNodes,
} from './dom';

import {
  RESET_STATE,
  START_EXTENSION,
  MARKET_ENTER,
  MARKET_READY,
  MARKET_EXIT,
} from '@shared/const';

export const init = async () => {
  try {
    await storage.active.clear();
    log.event(RESET_STATE);
    log.event(START_EXTENSION);
  } catch (error) {
    console.error(error);
  }
};

export const onMarketEnter = async ({ detail: id }) => {
  try {
    log.navigation(MARKET_ENTER, { id });

    messages.sendPricesSubscribe(id);

    await waitForUIUpdate(id);
    await messages.sendMarketEnter(id).then(renderComponents);
    await watchForAddedOrRemovedNodes(id);

    log.navigation(MARKET_READY, { id });
  } catch (error) {
    console.error(error);
  }
};

export const onMarketExit = async ({ detail: id }) => {
  try {
    log.navigation(MARKET_EXIT, { id });

    messages.sendMarketExit(id);
    messages.sendPricesUnsubscribe(id);

    unmountComponents(id);
  } catch (error) {
    console.error(error);
  }
};

window.addEventListener(MARKET_ENTER, onMarketEnter);
window.addEventListener(MARKET_EXIT, onMarketExit);
