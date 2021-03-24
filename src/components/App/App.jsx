import React, { useState, useEffect } from 'react';

import { Portal } from '@components/Portal';
import { PayoutHeader } from '@components/PayoutHeader';
import { OpenHighLowClose } from '@components/OpenHighLowClose';

import { $ } from '@shared/utils';
import { changes } from '@shared/storage';

export const App = (props) => {
  const [market, setMarket] = useState(props.market);
  const [contracts, setContracts] = useState(props.contracts);
  const [positions, setPositions] = useState(props.positions);
  const [prices, setPrices] = useState(props.prices);
  const [timespans, setTimespans] = useState(props.timespans);
  const state = { market, contracts, positions, prices, timespans };

  console.log('state', state);

  useEffect(() => {
    window.addEventListener('market.exit', () => {
      setMarket(null);
      setContracts(null);
      setPositions(null);
      setPrices(null);
      setTimespans(null);
    });
  }, []);

  useEffect(() => {
    const id = market?.id;

    const onMarketsChange = (changes) => {
      if (!changes[id]) return;
      const { contracts, prices, ...market } = changes[id].newValue;

      console.log('updating market', market);
      setMarket(market);

      console.log('updating contracts', contracts);
      setContracts(contracts);

      console.log('updating prices (market)', prices);
      setPrices(prices);
    };

    const onPositionsChange = (changes) => {
      if (!changes[id]) return;
      console.log('updating positions', changes[id].newValue);
      setPositions(changes[id].newValue.contracts);
    };

    const onPricesChange = (changes) => {
      if (!changes[id]) return;
      console.log('updating prices', changes[id].newValue);
      setPrices(changes[id].newValue);
    };

    const onTimespansChange = (changes) => {
      if (!changes[id]) return;
      console.log('updating timespans', changes[id].newValue);
      setTimespans(changes[id].newValue);
    };

    const marketsRef = changes.markets.subscribe(onMarketsChange);
    const positionsRef = changes.positions.subscribe(onPositionsChange);
    const pricesRef = changes.prices.subscribe(onPricesChange);
    const timespansRef = changes.timespans.subscribe(onTimespansChange);

    return () => {
      marketsRef.unsubscribe();
      positionsRef.unsubscribe();
      pricesRef.unsubscribe();
      timespansRef.unsubscribe();
    };
  }, [market]);

  if (!market || !contracts || !positions || !timespans) return null;

  return (
    <>
      {market && positions && Object.keys(positions).length === 0 && (
        <PayoutHeader id={market.id} prices={prices} />
      )}

      {Object.values(contracts)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((contract, index) => {
          return (
            <Portal
              key={index}
              id={contract.id}
              classes={['ohlc-container-root']}
              parent={$.contractRows.item(contract.displayOrder || index)}
            >
              <OpenHighLowClose timespans={timespans[contract.id]} />
            </Portal>
          );
        })}
    </>
  );
};
