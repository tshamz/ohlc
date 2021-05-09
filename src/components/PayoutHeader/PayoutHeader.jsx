import React, { useEffect } from 'react';

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
