import { useState, useEffect } from 'react';

import { $ } from '@shared/utils';

export const useTotalPrice = (prices) => {
  const [totalPrice, setTotalPrice] = useState();

  useEffect(() => {
    if ($.marketPayout && totalPrice) {
      $.marketPayout.setAttribute('data-total-price', totalPrice);
    }

    const onPayoutNodeAdded = () => {
      if (totalPrice) {
        $.marketPayout.setAttribute('data-total-price', totalPrice);
      }
    };

    window.addEventListener('payoutNode.added', onPayoutNodeAdded);

    return () => {
      window.removeEventListener('payoutNode.added', onPayoutNodeAdded);
    };
  }, [totalPrice]);

  useEffect(() => {
    if (!prices) {
      setTotalPrice(null);
      return;
    }

    const total = Object.values(prices)
      .map((prices) => prices?.buyYes || prices?.lastTrade || 0)
      .reduce((total, price) => total + price, 0)
      .toFixed(2);

    setTotalPrice(total);
  }, [prices]);

  return totalPrice;
};
