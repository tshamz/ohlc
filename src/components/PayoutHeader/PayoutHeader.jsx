import React, { useEffect } from 'react';
import { Global, css } from '@emotion/react';

export const PayoutHeader = ({ prices }) => {
  useEffect(() => {
    if (!prices) return;

    const total = Object.values(prices)
      .map((prices) => prices?.buyYes || prices?.lastTrade || 0)
      .reduce((total, price) => total + price, 0)
      .toFixed(2);

    document
      .querySelector('.market-payout--market')
      .setAttribute('data-total-price', total);
  }, [prices]);

  return (
    <>
      <Global styles={globalStyles} />
      <div className="market-detail__payout-header ohlc">
        <div className="market-detail__payout-header-col-1">
          Market Investment
        </div>
        <div className="market-detail__payout-header-col-2">Gain/Loss</div>
        <div className="market-detail__payout-header-col-3">Max. Payout</div>
      </div>

      <div className="market-payout market-payout--market ohlc">
        <div className="market-payout__col-1">
          <div className="market-payout__price">$0</div>
        </div>
        <div className="market-payout__col-2">
          <div className="market-payout__price">
            <span className="market-change-price market-change-price--plain">
              $0
            </span>
          </div>
        </div>
        <div className="market-payout__col-3">
          <div className="market-payout__price">
            <span className="market-payout__payout-link-raw">$0</span>
          </div>
        </div>
      </div>
    </>
  );
};

const globalStyles = css`
  .market-header-title-large {
    order: -1;
  }
  .market-payout--market,
  .market-detail__payout-header {
    order: 0;
  }

  .market-detail__contracts-header,
  .row-x {
    order: 1;
  }

  .market-detail__payout-header {
    display: flex;
    padding-left: 0 !important;
    padding-right: 0 !important;
    justify-content: space-between;
  }

  .market-detail__payout-header ~ .market-detail__payout-header.ohlc,
  .market-payout ~ .market-payout.ohlc {
    display: none;
  }

  .market-detail__payout-header > *,
  .market-payout--market > * {
    flex-basis: 25%;
    text-align: center;
    margin: 0 !important;
  }

  .market-detail__payout-header::after {
    content: 'Total Price';
    display: block;
    order: -1;
    flex-basis: 25%;
    text-align: center;
  }

  .market-detail__payout-header-col-1,
  .market-payout__col-1 {
    order: -1;
  }

  .market-payout--market::after {
    content: '$' attr(data-total-price);
    display: block;
    order: -1;
    flex-basis: 25%;
    color: #263b3f;
    font-size: 30px;
    font-weight: 300;
  }
`;
