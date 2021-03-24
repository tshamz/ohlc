import React, { useState } from 'react';

import { TIMESPANS } from '@shared/constants';

export const OpenHighLowClose = ({ timespans = {} }) => {
  const [active, setActive] = useState(TIMESPANS[1]);

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

    if (timespans[timespan]) {
      setActive(timespan);
    }
  };

  return (
    <div className="ohlc-container">
      <div data-toggles className="timespan-toggles">
        {TIMESPANS.map((label) => {
          const isActive = label === active ? 'active' : '';
          const isDisabled = !(label in timespans) ? 'disabled' : '';
          return (
            <button
              key={label}
              data-toggle={label}
              className={`timespan-toggle ${isActive} ${isDisabled}`}
              onClick={(event) => {
                event.stopPropagation();
                toggleTimespan(label, event);
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div data-timespans="" className="ohlc-timespan-container">
        {Object.entries(timespans).map(([timespan, datapoints]) => {
          const isActive = timespan === active ? 'active' : '';
          return (
            <div
              key={timespan}
              data-timespans={timespan}
              className={`timespan ${isActive}`}
            >
              {Object.entries(datapoints).map(([name, { label, distance }]) => {
                return (
                  <div key={name} className="datapoint" data-datapoint={name}>
                    <div className="datapoint-name">{`${name}: `}</div>
                    <div className="datapoint-values">
                      <div
                        data-value="raw"
                        className="datapoint-value active"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleLabelValue(event.target);
                        }}
                      >
                        {label || '-'}
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
          );
        })}
      </div>
    </div>
  );
};

export default OpenHighLowClose;
