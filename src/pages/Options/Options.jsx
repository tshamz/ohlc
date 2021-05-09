import React, { useEffect, useState } from 'react';
import './Options.css';

import * as storage from '@shared/storage';

const Options = () => {
  const [allMarkets, setAllMarkets] = useState();
  const [allContracts, setAllContracts] = useState();
  const [watchlist, setWatchlist] = useState();

  useEffect(() => {
    storage.markets.get().then(setAllMarkets);
    storage.contracts.get().then(setAllContracts);
    storage.watchlist.get().then(setWatchlist);
    storage.watchlist.valueStream.subscribe(setWatchlist);
  }, []);

  if (!allMarkets || !allContracts || !watchlist) return null;

  return (
    <div className="OptionsContainer">
      {Object.values(allMarkets).map((market) => (
        <MarketContainer
          key={market.id}
          market={market}
          allContracts={allContracts}
          watchlist={watchlist}
        />
      ))}
    </div>
  );
};

const MarketContainer = ({ market, allContracts, watchlist, ...props }) => {
  const totalWatchedContracts = market.contracts.filter((id) => watchlist[id]);
  const hasWatchedContracts = totalWatchedContracts.length > 0;
  const [contentVisible, setContentVisible] = useState(hasWatchedContracts);

  useEffect(() => {
    if (hasWatchedContracts) {
      setContentVisible(true);
    }
  }, [hasWatchedContracts]);

  return (
    <>
      <MarketRow
        watchlist={watchlist}
        contractIds={market.contracts}
        toggleContent={() => setContentVisible(!contentVisible)}
      >
        {market.shortName}
      </MarketRow>

      <MarketRow checkbox={false} contentVisible={contentVisible}>
        {market.contracts.map((id, index) => {
          return (
            <ContractRow
              key={id}
              id={allContracts[id].id}
              active={!!watchlist[id]}
              isFirst={index === 0}
            >
              {allContracts[id]?.shortName}
            </ContractRow>
          );
        })}
      </MarketRow>
    </>
  );
};

const MarketRow = ({
  watchlist,
  contractIds = [],
  checkbox = true,
  contentVisible = true,
  toggleContent = () => {},
  children,
}) => {
  const allContractsSelected = contractIds.every((id) => watchlist[id]);

  return (
    <div
      className={`market-row with-checkbox--${checkbox} show-content--${contentVisible}`}
    >
      <div className="checkbox-container">
        {checkbox && (
          <input
            type="checkbox"
            checked={!!allContractsSelected}
            onChange={() => {
              if (allContractsSelected) {
                storage.watchlist.remove(contractIds);
              } else {
                contractIds
                  .map((id) => ({ [id]: true }))
                  .forEach(storage.watchlist.set);
              }
            }}
          />
        )}
      </div>

      <div className="content-container" onClick={toggleContent}>
        {children}
      </div>
    </div>
  );
};

const ContractRow = ({ id, active, isFirst, children }) => {
  return (
    <div className={`contract-row first--${isFirst}`}>
      <div className="checkbox-container">
        <input
          type="checkbox"
          id={id}
          name={id}
          checked={active}
          onChange={(event) => {
            if (event.target.checked) {
              storage.watchlist.set({ [event.target.name]: true });
            } else {
              storage.watchlist.remove(event.target.name);
            }
          }}
        />
      </div>

      <label htmlFor={id} className="content-container">
        {children}
      </label>
    </div>
  );
};

export default Options;
