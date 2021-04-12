export const EXTENSION_ID = `kpbkdojlmgnjcgdmjgdnfgdnmkcdgplo`;
export const PREDICTIT_DOT_ORG = `https://www.predictit.org`;

export const TIMESPANS = ['1h', '24h', '7d', '30d', '90d'];

/* EVENTS */
export const MARKET_ENTER = 'market.enter';
export const MARKET_EXIT = 'market.exit';
export const MARKET_READY = 'market.ready';
export const POSITION_CHANGE = 'position.change';
export const MARKETS_UPDATE_INTERVAL = 'alarm.markets.update';
export const CONTRACTS_UPDATED_INTERVAL = 'alarm.contracts.update';

/* KEYS */
export const MARKET_KEYS = [
  'id',
  'active',
  'contracts',
  'dateEnd',
  'daysLeft',
  'investment',
  'isOpen',
  'maxPayout',
  'name',
  'shortName',
  'status',
  'totalSharesTraded',
  'type',
  'url',
  '_updatedAt',
];

export const CONTRACT_KEYS = [
  'id',
  'name',
  'shortName',
  'market',
  'displayOrder',
  'openBuyOrders',
  'openSellOrders',
  'pricePerShare',
  'quantity',
];

export const PRICE_KEYS = [
  'id',
  'shortName',
  'buyNo',
  'buyYes',
  'sellNo',
  'sellYes',
  'lastClose',
  'lastTrade',
];

export const CONTRACT_POSITION_KEYS = [
  'id',
  'buyNo',
  'buyYes',
  'lastClose',
  'lastTrade',
  'market',
  'name',
  'openBuyOrders',
  'openSellOrders',
  'prediction',
  'pricePerShare',
  'quantity',
];

export const KEY_MAP = {
  contractId: 'id',
  marketId: 'id',
  bestBuyNoCost: 'buyNo',
  bestBuyYesCost: 'buyYes',
  bestNoPrice: 'buyNo',
  bestSellNoCost: 'sellNo',
  bestSellYesCost: 'sellYes',
  bestYesPrice: 'buyYes',
  contractDisplayOrder: 'displayOrder',
  contractImageUrl: 'image',
  contractIsActive: 'isActive',
  contractIsOpen: 'isOpen',
  contractName: 'name',
  lastClosePrice: 'lastClose',
  lastTradePrice: 'lastTrade',
  marketContractDisplayOrder: 'contractDisplayOrder',
  marketContracts: 'contracts',
  marketDisplayOrder: 'displayOrder',
  marketImageUrl: 'image',
  marketName: 'name',
  marketSharesTraded: 'totalSharesTraded',
  marketShortName: 'shortName',
  marketType: 'type',
  marketUrl: 'url',
  userAveragePricePerShare: 'pricePerShare',
  userInvestment: 'investment',
  userMaxPayout: 'maxPayout',
  userOpenOrdersBuyQuantity: 'openBuyOrders',
  userOpenOrdersSellQuantity: 'openSellOrders',
  userPrediction: 'prediction',
  userQuantity: 'quantity',
};

export const KEYS = {
  MARKET_KEYS,
  CONTRACT_KEYS,
  PRICE_KEYS,
  CONTRACT_POSITION_KEYS,
  KEY_MAP,
};
