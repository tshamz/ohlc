import React, { useEffect, useState } from 'react';

import { Portal } from '@components/Portal';

export const PayoutHeader = ({ id, prices }) => {
  const [totalPrice, setTotalPrice] = useState();

  useEffect(() => {
    if (!prices) return;

    const total = Object.values(prices)
      .map((prices) => prices?.buyYes || prices?.lastTrade || 0)
      .reduce((total, price) => total + price, 0)
      .toFixed(2);

    setTotalPrice(total);
  }, [prices]);

  return (
    <>
      <Portal
        id={`payout-header-${id}-root`}
        classes={['market-detail__payout-header', 'ohlc']}
        parent={document.querySelector('.market-detail')}
      >
        <div className="market-detail__payout-header-col-1">
          Market Investment
        </div>
        <div className="market-detail__payout-header-col-2">Gain/Loss</div>
        <div className="market-detail__payout-header-col-3">Max. Payout</div>
        <div className="market-detail__payout-header-col-1-1">Total Price</div>
      </Portal>

      <Portal
        id={`market-payout-${id}-root`}
        classes={['market-payout', 'market-payout--market', 'ohlc']}
        parent={document.querySelector('.market-detail')}
      >
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
        <div className="market-payout__col-1-1">
          <div className="market-payout__price">${totalPrice}</div>
        </div>
      </Portal>
    </>
  );
};
