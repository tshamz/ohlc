import * as storage from '@shared/storage';
import * as messages from '@shared/messages';
import * as firebase from '@shared/firebase';

import { CACHE_MARKETS } from '@shared/const';

try {
  // const periodInMinutes = 1;
  // const delayInMinutes = 60;
  const delayInMinutes = 0;
  const periodInMinutes = 60 * 4;

  const getInitialData = async (id) => {
    const market = await storage.getMarket(id);

    const [contracts, prices, timespans] = await Promise.all([
      storage.contracts.get(market.contracts),
      storage.prices.get(market.contracts),
      storage.timespans.get(market.contracts),
    ]);

    return { market, contracts, prices, timespans };
  };

  const onPriceChange = (snapshot) => {
    storage.active.set({ prices: snapshot.val() });
  };

  chrome.alarms.create(CACHE_MARKETS, { delayInMinutes, periodInMinutes });

  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === CACHE_MARKETS) {
      const markets = await firebase.markets.get();
      await storage.markets.clear();
      await storage.markets.set(markets);
    }
  });

  messages.marketEnterStream.subscribe(async ([id, sender, sendResponse]) => {
    try {
      getInitialData(id).then(storage.active.set).then(sendResponse);

      firebase.market.prices.subscribe(id, onPriceChange);
    } catch (error) {
      console.error(error);
    }
  });

  messages.marketExitStream.subscribe(([id]) => {
    storage.active.clear();

    firebase.market.prices.unsubscribe(id, onPriceChange);
  });
} catch (error) {
  console.error(error);
}
