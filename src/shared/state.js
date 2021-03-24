import React from 'react';
import { StateMachineProvider, createStore } from 'little-state-machine';

const initialState = {
  market: null,
  contracts: null,
  prices: null,
  positions: null,
  timespans: null,
};

// createStore(initialState, {
//   middleWares: [],
//   storageType: {
//     setItem: () => {},
//     getItem: () => {
//       return initialState;
//     },
//   },
// });

export const clearMarket = () => ({ ...initialState });

export const setInitialState = (state, payload) => {
  return payload;
};

export const updateMarket = (state, payload = {}) => {
  // const { contracts, prices, ...market } = payload;

  return payload;
  // return {
  //   ...state,
  //   market: {
  //     ...state.market,
  //     ...market,
  //   },
  //   prices: prices,
  //   contracts: contracts,
  // };
};

export const updatePositions = (state, payload = {}) => {
  const { contracts, ...market } = payload;

  return {
    ...state,
    market: {
      ...state.market,
      ...market,
    },
    positions: contracts || null, // because sometimes contracts is undefined
  };
};

export const updatePrices = (state, payload = {}) => {
  return {
    ...state,
    prices: payload,
  };
};

export const updateTimespans = (state, payload = {}) => {
  return {
    ...state,
    timespans: payload,
  };
};

// prettier-ignore
// export const StateProvider = ({ children }) => (
//   <StateMachineProvider>
//     {children}
//   </StateMachineProvider>
// );

// export { DevTool } from 'little-state-machine-devtools';
