import { getMessage } from '@extend-chrome/messages';

export const [
  marketEnterSend,
  marketEnterStream,
  marketEnterReady,
] = getMessage('MARKET_ENTER');

// prettier-ignore
export const [
  marketExitSend,
  marketExitStream,
  marketExitReady,
] = getMessage('MARKET_EXIT');
