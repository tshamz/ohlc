import state from 'state-local';

const initialState = {
  market: null,
  prices: {},
  positions: {},
};

const handleMarketUpdate = () => {};
const handlePricesUpdate = () => {};
const handlePositionsUpdate = () => {};

const [getState, setState] = state.create(initialState, {
  market: handleMarketUpdate,
  prices: handlePricesUpdate,
  positions: handlePositionsUpdate,
});
