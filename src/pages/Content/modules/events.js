import log, { logError } from './log.js';
import { fetchPositions } from './fetch';
import { mountReactApps, watchContractRows } from './dom';
import { dom, fromStorage, pause, getMarketIdFromPath } from './utils';

export const onMarketEnter = async (event) => {
  try {
    log.event(` market enter `.bgLightYellow, { id: event.detail });

    const market = await fromStorage(`markets.${event.detail}`);

    const onMarketReady = async () => {
      log.event(` market ready `.bgLightGreen, { id: event.detail });

      if (dom.showMoreToggle) {
        dom.showMoreToggle.click();
        await pause(500);
      }

      mountReactApps(market);
      watchContractRows(market);
    };

    const contractsObserver = new MutationObserver((mutations, observer) => {
      if (dom.contracts.length) {
        observer.disconnect();
        onMarketReady();
      }
    });

    contractsObserver.observe(dom.appRoot, {
      subtree: true,
      childList: true,
    });
  } catch (error) {
    logError(error);
  }
};

export const onMarketExit = (event) => {
  try {
    log.event(` market exit `.bgLightRed, { detail: event.detail });
  } catch (error) {
    logError(error);
  }
};

export const init = async () => {
  try {
    log(`extension starting...`.lightGreen.italic);

    if (window.localStorage.getItem('token') !== null) {
      await fetchPositions();
    }

    if (window.location.pathname.includes('markets/detail')) {
      window.dispatchEvent(
        new CustomEvent('marketenter', {
          detail: getMarketIdFromPath(window.location.pathname),
        })
      );
    }
  } catch (error) {
    logError(error);
  }
};
