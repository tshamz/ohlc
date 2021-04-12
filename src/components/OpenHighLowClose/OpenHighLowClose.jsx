import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';

import { TIMESPANS } from '@shared/constants';
import {
  calculatePriceDistance,
  calculateVolumeDistance,
} from '@shared/prices';

export const OpenHighLowClose = ({
  prices,
  timespans,
  totalSharesTraded,
  allActiveTimespans,
  setAllActiveTimespans,
}) => {
  const [allActiveValue, setAllActiveValue] = useState('value');
  const [activeTimespan, setActiveTimespan] = useState(allActiveTimespans);
  const [debounceClickEvents, setDebounceClickEvents] = useState([]);

  useEffect(() => {
    setActiveTimespan(allActiveTimespans);
  }, [allActiveTimespans]);

  const onDoubleClicked = (timespan) => (event) => {
    event.stopPropagation();
    if (debounceClickEvents.length > 0) {
      debounceClickEvents.forEach((debounce) => debounce.cancel());
      setDebounceClickEvents([]);
    }
    setAllActiveTimespans(timespan);
  };

  const onClicked = (timespan) => (event) => {
    event.stopPropagation();
    const callback = debounce(() => {
      setDebounceClickEvents([]);

      if (!(timespan in timespans)) return;

      if (timespan !== activeTimespan) {
        setActiveTimespan(timespan);
        return;
      }

      if (allActiveValue === 'value') {
        setAllActiveValue('distance');
      } else {
        setAllActiveValue('value');
      }
    }, 150);
    setDebounceClickEvents([...debounceClickEvents, callback]);
    callback();
  };

  return (
    <div className={`ohlc-container is-active--${activeTimespan}`}>
      <div data-toggles className="timespan-toggles">
        {TIMESPANS.map((label) => {
          return (
            <button
              key={label}
              data-toggle={label}
              // prettier-ignore
              className={`timespan-toggle is-${label}-toggle is-disabled--${!timespans[label]}`}
              onClick={onClicked(label)}
              onDoubleClick={onDoubleClicked(label)}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="ohlc-timespan-container">
        {Object.entries(timespans).map(([timespan, datapoints]) => {
          return (
            <div
              key={timespan}
              data-timespans={timespan}
              className={`timespan is-${timespan}`}
            >
              {Object.entries(datapoints).map(([name, { value, label }]) => (
                <OpenHighLowCloseValue
                  key={name}
                  name={name}
                  label={label}
                  value={value}
                  prices={prices}
                  allActiveValue={allActiveValue}
                  totalSharesTraded={totalSharesTraded}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const OpenHighLowCloseValue = ({
  name,
  label,
  value,
  prices,
  allActiveValue,
  totalSharesTraded,
}) => {
  const [activeValue, setActiveValue] = useState(allActiveValue);

  useEffect(() => {
    setActiveValue(allActiveValue);
  }, [allActiveValue]);

  const distance =
    name === 'volume'
      ? calculateVolumeDistance(value, totalSharesTraded)
      : calculatePriceDistance(value, prices);

  return (
    <div key={name} className="datapoint" data-datapoint={name}>
      <div className="datapoint-name">{`${name}: `}</div>
      <div className={`datapoint-values is-active--${activeValue}`}>
        <div
          data-value="raw"
          className={`datapoint-value is-value`}
          onClick={(event) => {
            event.stopPropagation();
            setActiveValue('distance');
          }}
        >
          {label || '-'}
        </div>

        <div
          data-value="distance"
          className={`datapoint-value is-distance`}
          onClick={(event) => {
            event.stopPropagation();
            setActiveValue('value');
          }}
        >
          {distance?.direction}
          {distance?.label}
        </div>
      </div>
    </div>
  );
};

export default OpenHighLowClose;
