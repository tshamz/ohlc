import { active } from '@shared/storage';
import * as log from '@shared/log';
import * as messages from '@shared/messages';

import {
  renderComponents,
  unmountComponents,
  waitForUIUpdate,
  watchForAddedOrRemovedNodes,
} from './dom';

export const init = async () => {
  try {
    await active
      .clear()
      .then(log.event.init('reset.state'))
      .then(log.event.init('start.extension'));
  } catch (error) {
    console.error(error);
  }
};

export const onMarketEnter = async ({ detail: id }) => {
  try {
    log.event.navigation('market.enter')({ id });

    await waitForUIUpdate(id);
    await messages.sendMarketEnter(id).then(renderComponents);
    await watchForAddedOrRemovedNodes(id);

    log.event.navigation('market.ready')({ id });
  } catch (error) {
    console.error(error);
  }
};

export const onMarketExit = async ({ detail: id }) => {
  try {
    log.event.navigation('market.exit')({ id });

    await messages.sendMarketExit(id);
    unmountComponents(id);
  } catch (error) {
    console.error(error);
  }
};

window.addEventListener('market.enter', onMarketEnter);
window.addEventListener('market.exit', onMarketExit);
