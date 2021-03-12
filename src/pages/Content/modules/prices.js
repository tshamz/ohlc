const round = (value, precision) => {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};

const formatCents = (amount) => round(amount * 100, 2).toFixed(2);
const getPrices = (key) => (row) => row[key];
const getTotal = (key) => (sum, row) => sum + row[key];

export const calculateTimespansPrices = (timespans) => {
  return Object.entries(timespans).reduce((timespanPrices, [key, values]) => {
    const open = values.reduce(getTotal('open'), 0) / values.length;
    const high = values.map(getPrices('high')).sort()[values.length - 1];
    const low = values.map(getPrices('low')).sort()[0];
    const close = values.reduce(getTotal('close'), 0) / values.length;
    const volume = values.reduce(getTotal('volume'), 0);
    // const age = ((Date.now() - contract._createdAt) / 1000) * 60 * 10 * 24;

    return {
      ...timespanPrices,
      [key]: {
        open: {
          value: open,
          label: formatCents(open),
          distance: ({ lastTrade }) => {
            if (!open) return null;
            const value = round((lastTrade - open) * 100, 2);
            const direction = value === 0 ? '' : value > 0 ? '+' : '-';
            const label = Math.abs(value).toFixed(1);
            return { label, direction };
          },
        },
        high: {
          value: high,
          label: formatCents(high),
          distance: ({ lastTrade }) => {
            if (!high) return null;
            const value = round((lastTrade - high) * 100, 2);
            const direction = value === 0 ? '' : value > 0 ? '+' : '-';
            const label = Math.abs(value).toFixed(1);
            return { label, direction };
          },
        },
        low: {
          value: low,
          label: formatCents(low),
          distance: ({ lastTrade }) => {
            if (!low) return null;
            const value = round((lastTrade - low) * 100, 2);
            const direction = value === 0 ? '' : value > 0 ? '+' : '-';
            const label = Math.abs(value).toFixed(1);
            return { label, direction };
          },
        },
        close: {
          value: close,
          label: formatCents(close),
          distance: ({ lastTrade }) => {
            if (!close) return null;
            const value = round((lastTrade - close) * 100, 2);
            const direction = value === 0 ? '' : value > 0 ? '+' : '-';
            const label = Math.abs(value).toFixed(1);
            return { label, direction };
          },
        },
        volume: {
          value: volume,
          label: (volume / 1000).toFixed(2) + `K`,
          distance: ({ market }) => {
            const percentage = (volume / market.totalSharesTraded) * 100;
            const label = percentage.toFixed(2) + '%';
            return { label, direction: '' };
          },
        },
      },
    };
  }, {});
};
