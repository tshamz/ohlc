import * as storage from '@shared/storage';
import * as messages from '@shared/messages';

import { CACHE_MARKETS } from '@shared/const';

try {
  // const periodInMinutes = 1;
  // const delayInMinutes = 0;
  const delayInMinutes = 60;
  const periodInMinutes = 60 * 4;
  const alarmOptions = { delayInMinutes, periodInMinutes };

  const getInitialData = async (id) => {
    try {
      const market = await storage.getMarket(id);

      const [contracts, prices, timespans] = await Promise.all([
        storage.getMarketContracts(market),
        storage.getMarketPrices(market),
        storage.getMarketTimespans(market),
      ]);

      return { market, contracts, prices, timespans };
    } catch (error) {
      console.error(error);
    }
  };

  const onAlarm = (alarm) =>
    alarm.name === CACHE_MARKETS && storage.cacheMarkets();

  const onMarketEnter = ([id, sender, sendResponse]) => {
    getInitialData(id)
      .then(storage.active.set)
      .then(sendResponse)
      .catch((error) => console.error(error));
  };

  chrome.alarms.create(CACHE_MARKETS, alarmOptions);
  chrome.alarms.onAlarm.addListener(onAlarm);

  messages.marketEnterStream.subscribe(onMarketEnter);
  messages.marketExitStream.subscribe(storage.active.clear);
} catch (error) {
  console.error(error);
}
