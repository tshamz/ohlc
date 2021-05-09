import React, { useEffect, useState } from 'react';

import * as log from '@shared/log';

const sortTimespans = ([a], [b]) => {
  const order = ['1h', '24h', '7d', '30d', '90d'];
  return order.indexOf(a) - order.indexOf(b);
};

const round = (value, precision) => {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};

export const OpenHighLowClose = ({
  prices,
  timespans,
  globalActiveTimespans,
  setGlobalActiveTimespans,
}) => {
  const [activeTimespan, setActiveTimespan] = useState(globalActiveTimespans);

  useEffect(() => {
    log.event.lifecycle('mount')({ component: 'OHLC' });

    return () => {
      log.event.lifecycle('unmount')({ component: 'OHLC' });
    };
  }, []);

  useEffect(() => {
    setActiveTimespan(globalActiveTimespans);
  }, [globalActiveTimespans]);

  if (!timespans) return null;

  const sortedTimespanEntries = Object.entries(timespans).sort(sortTimespans);

  return (
    <div className="ohlc-container-root">
      <div className="ohlc-container">
        <div data-toggles className="ohlc-timespan-toggles">
          {sortedTimespanEntries.map(([timespan]) => {
            const isActive = timespan === activeTimespan ? 'active' : '';

            return (
              <button
                key={timespan}
                timespan={timespan}
                data-toggle={timespan}
                className={`ohlc-timespan-toggle ${isActive}`}
                onClick={(event) => {
                  event.stopPropagation();
                  if (timespan === activeTimespan) {
                    setGlobalActiveTimespans(timespan);
                  } else {
                    setActiveTimespan(timespan);
                  }
                }}
              >
                {timespan}
              </button>
            );
          })}
        </div>

        <div className="ohlc-timespan-container">
          {sortedTimespanEntries.map(([timespan, datapoints]) => {
            const isActive = timespan === activeTimespan ? 'active' : '';

            return (
              <div
                key={timespan}
                timespan={timespan}
                data-timespans={timespan}
                className={`ohlc-timespan ${isActive}`}
              >
                {Object.entries(datapoints).map(([name, value]) => {
                  return (
                    <div
                      key={name}
                      timespan={name}
                      className="ohlc-datapoint"
                      data-datapoint={name}
                    >
                      <div className="ohlc-datapoint-name">{`${name}: `}</div>

                      <div className="ohlc-datapoint-value" data-value="raw">
                        {name === 'volume'
                          ? (value / 1000).toFixed(3) + `K`
                          : round(value * 100, 2).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OpenHighLowClose;
