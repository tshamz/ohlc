/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

import log from '../../pages/Content/modules/log';
import { fetchPath, db } from '../../pages/Content/modules/firebase';
import { calculateTimespansPrices } from '../../pages/Content/modules/prices';

const DATAPOINTS = ['open', 'high', 'low', 'close', 'volume'];
const TIMESPANS = {
  hour: '1h',
  day: '24h',
  week: '7d',
  month: '30d',
  quarter: '90d',
};

export const OpenHighLowClose = ({ market, contract, ...props }) => {
  const [active, setActive] = useState('24h');
  const [lastTrade, setLastTrade] = useState();
  const [timespanPrices, setTimespanPrices] = useState();

  useEffect(() => {
    const path = `prices/${contract.id}`;
    const ref = fetchPath(path);

    const listener = ref.on('value', async (snapshot) => {
      const prices = snapshot.val();
      setLastTrade(prices?.lastTrade);

      log.quiet(`prices updated`.lightGreen.bright, prices);
    });

    return () => ref.off('value', listener);
  }, []);

  useEffect(() => {
    const path = `${market.id}/${contract.id}`;
    const database = db.timespans;
    const ref = fetchPath(path, database);

    const listener = ref.on('value', async (snapshot) => {
      const data = snapshot.val();
      const day = data?.['24h'] || [];
      const hour = day.slice(-1);
      const update = calculateTimespansPrices({ '1h': hour, ...data });

      setTimespanPrices(update);
    });

    return () => ref.off('value', listener);
  }, []);

  useEffect(() => {}, [lastTrade, timespanPrices]);

  const toggleLabelValue = (target) => {
    target.classList.remove('active');
    target.nextElementSibling?.classList.add('active');
    target.previousElementSibling?.classList.add('active');
  };

  const toggleAllTimespanLabelValues = (timespan, target) => {
    const $ = target.closest('.ohlc');
    const $timespan = $.querySelector(`[data-timespans="${timespan}"]`);
    const $values = Array.from($timespan.querySelectorAll(`[data-value]`));
    const match = $values.find((value) => value.classList.contains('active'));
    const type = match.dataset.value;
    const actives = $values.filter((value) => value.dataset.value !== type);
    $values.forEach((value) => value.classList.remove('active'));
    actives.forEach((value) => value.classList.add('active'));
  };

  const toggleTimespan = (timespan, event) => {
    if (active === timespan) {
      toggleAllTimespanLabelValues(timespan, event.target);
    }

    setActive(timespan);
  };

  return (
    <div {...props}>
      <div data-toggles className="timespan-toggles">
        {Object.values(TIMESPANS).map((label) => (
          <button
            key={label}
            data-toggle={label}
            className={`timespan-toggle ${label === active ? 'active' : ''}`}
            onClick={(event) => {
              event.stopPropagation();
              toggleTimespan(label, event);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div data-timespans="">
        {Object.values(TIMESPANS).map((label) => (
          <div
            key={label}
            data-timespans={label}
            className={`timespan ${label === active ? 'active' : ''}`}
          >
            {Object.values(DATAPOINTS).map((name) => {
              const values = timespanPrices?.[label]?.[name];
              const distance = values?.distance({ lastTrade, market });

              return (
                <div key={name} className="datapoint" data-datapoint={name}>
                  <div className="datapoint-name">{`${name}: `}</div>
                  <div className="datapoint-values">
                    <div
                      className="datapoint-value active"
                      data-value="raw"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleLabelValue(event.target);
                      }}
                    >
                      {values?.label || '-'}
                    </div>

                    <div
                      data-value="change"
                      className={`datapoint-value`}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleLabelValue(event.target);
                      }}
                    >
                      {distance?.direction}
                      {distance?.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpenHighLowClose;
