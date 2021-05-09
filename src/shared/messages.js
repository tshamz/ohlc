import { getMessage } from '@extend-chrome/messages';

export const [
  sendMarketEnter,
  marketEnterStream,
  waitForMarketEnter,
] = getMessage('market.enter', { async: true });

// prettier-ignore
export const [
  sendMarketExit,
  marketExitStream,
  waitForMarketExit,
] = getMessage('market.exit');
