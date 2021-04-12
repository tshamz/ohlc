import React, { useState, useEffect } from 'react';

import { Portal } from '@components/Portal';
import { PayoutHeader } from '@components/PayoutHeader';
import { useTotalPrice } from '@components/useTotalPrice';
import { OpenHighLowClose } from '@components/OpenHighLowClose';

import { $ } from '@shared/utils';
// import * as storage from '@shared/storage';

export const App = (props) => {
  const [state, setState] = useState(props);
  const [allActiveTimespans, setAllActiveTimespans] = useState('24h');

  useTotalPrice(state.prices);

  useEffect(() => {
    if (!state.market) return;

    const id = state.market.id;

    // const marketsRef = storage.markets.changes.subscribe((changes) => {
    //   if (!changes[id]) return;

    //   const { contracts, prices, ...market } = changes[id].newValue;

    //   setState({
    //     ...state,
    //     contracts,
    //     prices,
    //     market: { ...state.market, ...market },
    //   });
    // });

    // const positionsRef = storage.positions.changes.subscribe((changes) => {
    //   if (!changes[id]) return;
    //   setState({ ...state, positions: changes[id].newValue.contracts });
    // });

    // prettier-ignore
    // const pricesRef = storage.prices.changes.subscribe((changes) => {
    //   const contractIds = Object.keys(state.contracts);
    //   const activeChanges = contractIds
    //     .reduce((updates, id) => ({ ...updates, ...changes[id]?.newValue }), {})
    //   if (!Object.keys(activeChanges).length) return;
    //   setState({ ...state, prices: { ...state.prices, ...activeChanges } });
    // });

    // const timespansRef = storage.timespans.changes.subscribe((changes) => {
    //   if (!changes[id]) return;
    //   setState({ ...state, timespans: changes[id].newValue.contracts });
    // });

    return () => {
      // marketsRef.unsubscribe();
      // positionsRef.unsubscribe();
      // pricesRef.unsubscribe();
      // timespansRef.unsubscribe();
    };
  }, [state]);

  useEffect(() => {
    setState(props);
  }, [props]);

  const ready =
    !!state.market &&
    !!state.contracts &&
    !!state.positions &&
    !!state.timespans &&
    !!state.prices;

  if (!ready) return null;

  return (
    <>
      <PayoutHeader market={state.market} />

      {Object.values(state.contracts)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((contract, index) => {
          return (
            <Portal
              key={index}
              id={contract.id}
              classes={['ohlc-container-root']}
              parent={$.contractRows.item(contract.displayOrder || index)}
            >
              <OpenHighLowClose
                prices={state.prices[contract.id]}
                timespans={state.timespans[contract.id]}
                totalSharesTraded={state.market.totalSharesTraded}
                allActiveTimespans={allActiveTimespans}
                setAllActiveTimespans={setAllActiveTimespans}
              />
            </Portal>
          );
        })}
    </>
  );
};
