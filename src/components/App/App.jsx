import React, { useEffect, useState } from 'react';
import { map, skip, filter } from 'rxjs/operators';
import { Portal } from 'react-portal';

import { Styles } from '@components/Styles';
import { PayoutHeader } from '@components/PayoutHeader';
import { OpenHighLowClose } from '@components/OpenHighLowClose';

import * as log from '@shared/log';
import * as storage from '@shared/storage';

import { MOUNT, UNMOUNT } from '@shared/const';

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
    log.lifecycle(MOUNT, { component: 'App' });

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
      log.lifecycle(UNMOUNT, { component: 'App' });

      marketSubscription.unsubscribe();
      pricesSubscription.unsubscribe();
      timespansSubscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Styles />

      <Portal node={document.querySelector('.market-detail')}>
        <PayoutHeader prices={prices} />
      </Portal>

      {market?.contracts?.map((contractId) => {
        const contractPrices = prices?.[contractId];
        const contractTimespans = timespans?.[contractId];
        const isError = !contractPrices || !contractTimespans;

        return (
          <Portal key={contractId} node={getTargetNode(contractId)}>
            <div
              css={{
                width: '140px',
                height: '100px',
                fontSize: '12px',
                paddingTop: '10px',
                paddingBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isError ? (
                <span css={{ paddingLeft: '15px' }}>⚠️</span>
              ) : (
                <OpenHighLowClose
                  contractId={contractId}
                  prices={contractPrices}
                  timespans={contractTimespans}
                  globalActiveTimespans={globalActiveTimespans}
                  setGlobalActiveTimespans={setGlobalActiveTimespans}
                />
              )}
            </div>
          </Portal>
        );
      })}
    </>
  );
};

App.displayName = App;
