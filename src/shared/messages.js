import { getMessage } from '@extend-chrome/messages';
import {
  MARKET_ENTER,
  MARKET_EXIT,
  MARKET_PRICES_SUBSCRIBE,
  MARKET_PRICES_UNSUBSCRIBE,
} from '@shared/const';

export const [
  sendMarketEnter,
  marketEnterStream,
  waitForMarketEnter,
] = getMessage(MARKET_ENTER, { async: true });

// prettier-ignore
export const [
  sendMarketExit,
  marketExitStream,
  waitForMarketExit,
] = getMessage(MARKET_EXIT);

export const [
  sendPricesSubscribe,
  pricesSubscribeStream,
  waitForPricesSubscribe,
] = getMessage(MARKET_PRICES_SUBSCRIBE);

export const [
  sendPricesUnsubscribe,
  pricesUnsubscribeStream,
  waitForPricesUnSubscribe,
] = getMessage(MARKET_PRICES_UNSUBSCRIBE);
