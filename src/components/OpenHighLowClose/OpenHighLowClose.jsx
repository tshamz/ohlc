import React, { useEffect, useState } from 'react';

import * as log from '@shared/log';

import { MOUNT, UNMOUNT } from '@shared/const';

const TIMESPANS = ['1h', '24h', '7d', '30d', '90d'];
const DATAPOINTS = ['open', 'high', 'low', 'close', 'volume'];
const ROW_HEIGHT = `${(1 / TIMESPANS.length) * 100}%`;

const sortValues = (order) => ([a], [b]) => order.indexOf(a) - order.indexOf(b);
const sortTimespans = sortValues(TIMESPANS);
const sortDatapoints = sortValues(DATAPOINTS);

const prepareDatapoints = ([name, value]) => [
  name,
  name === 'volume'
    ? (value / 1000).toFixed(3) + `K`
    : round(value * 100, 2).toFixed(2),
];

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
    log.lifecycle(MOUNT, { component: 'OHLC' });

    return () => {
      log.lifecycle(UNMOUNT, { component: 'OHLC' });
    };
  }, []);

  useEffect(() => {
    setActiveTimespan(globalActiveTimespans);
  }, [globalActiveTimespans]);

  if (!timespans) return null;

  // const data = Object.entries(timespans)
  //   .sort(sortTimespans)
  //   .map(([timespan, datapoints]) => {
  //     const { open, high, low, close } = datapoints;

  //     return [
  //       timespan,
  //       round(open * 100000) / 100000,
  //       round(high * 100000) / 100000,
  //       round(low * 100000) / 100000,
  //       round(close * 100000) / 100000,
  //     ];
  //   });

  return (
    <div css={{ display: 'flex', height: '100%' }}>
      <div
        data-toggles
        css={{
          display: 'flex',
          marginRight: '4px',
          flexDirection: 'column',
          borderRight: '1px solid',
        }}
      >
        {Object.entries(timespans)
          .sort(sortTimespans)
          .map(([timespan]) => {
            return (
              <button
                key={timespan}
                timespan={timespan}
                data-toggle={timespan}
                css={{
                  lineHeight: 1,
                  outline: 'none',
                  cursor: 'pointer',
                  textAlign: 'right',
                  paddingLeft: '4px',
                  paddingRight: '4px',
                  height: ROW_HEIGHT,
                  fontWeight: timespan === activeTimespan ? 900 : 400,
                }}
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

      <div>
        {Object.entries(timespans)
          .sort(sortTimespans)
          .map(([timespan, datapoints]) => {
            return (
              <div
                key={timespan}
                timespan={timespan}
                data-timespans={timespan}
                css={{
                  width: '105px',
                  height: '100%',
                  flexDirection: 'column',
                  display: timespan === activeTimespan ? 'flex' : 'none',
                }}
              >
                {Object.entries(datapoints)
                  .sort(sortDatapoints)
                  .map(prepareDatapoints)
                  .map(([name, value]) => {
                    return (
                      <div
                        key={name}
                        timespan={name}
                        data-datapoint={name}
                        css={{
                          display: 'flex',
                          alignItems: 'center',
                          height: ROW_HEIGHT,
                        }}
                      >
                        <div>{`${name}: `}</div>

                        <div
                          data-value="raw"
                          css={{
                            flex: 1,
                            fontWeight: 600,
                            textAlign: 'right',
                          }}
                        >
                          {value}
                        </div>
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default OpenHighLowClose;
