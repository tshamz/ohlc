import React, { useEffect, useState } from 'react';
import { map, skip, filter } from 'rxjs/operators';
import { Portal } from 'react-portal';

import { PayoutHeader } from '@components/PayoutHeader';
import { OpenHighLowClose } from '@components/OpenHighLowClose';

import * as log from '@shared/log';
import * as storage from '@shared/storage';

const getTargetNode = (id) => {
  const selector = `[data-contract-id="${id}"] .market-contract-horizontal-v2__row`;
  return document.querySelector(selector);
};

export const App = (initial) => {
  const [market, setMarket] = useState(initial.market);
  const [prices, setPrices] = useState(initial.prices);
  const [timespans, setTimespans] = useState(initial.timespans);
  const [globalActiveTimespans, setGlobalActiveTimespans] = useState('1h');

  useEffect(() => {
    log.event.lifecycle('mount')({ component: 'App' });

    const marketSubscription = storage.active.changeStream
      .pipe(filter(({ market }) => market))
      .pipe(map(({ market }) => market.newValue))
      .subscribe(setMarket);

    const pricesSubscription = storage.active.changeStream
      .pipe(filter(({ prices }) => prices))
      .pipe(map(({ prices }) => prices.newValue))
      .subscribe(setPrices);

    const timespansSubscription = storage.timespans.valueStream
      .pipe(skip(1))
      .subscribe(setTimespans);

    return () => {
      log.event.lifecycle('unmount')({ component: 'App' });

      marketSubscription.unsubscribe();
      pricesSubscription.unsubscribe();
      timespansSubscription.unsubscribe();
    };
  }, []);

  if (!market?.contracts) return null;

  return (
    <>
      <Portal node={document.querySelector('.market-detail')}>
        <PayoutHeader prices={prices} />
      </Portal>

      {market.contracts.map((contractId) => {
        return (
          <Portal key={contractId} node={getTargetNode(contractId)}>
            <OpenHighLowClose
              contractId={contractId}
              prices={prices[contractId]}
              timespans={timespans[contractId]}
              totalSharesTraded={market.totalSharesTraded}
              globalActiveTimespans={globalActiveTimespans}
              setGlobalActiveTimespans={setGlobalActiveTimespans}
            />
          </Portal>
        );
      })}
    </>
  );
};

App.displayName = App;
