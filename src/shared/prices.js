const round = (value, precision) => {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};

const formatCents = (amount) => round(amount * 100, 2).toFixed(2);
const getPrices = (key) => (row) => row[key];
const getTotal = (key) => (sum, row) => sum + row[key];

export const calculatePrices = (timespans) => {
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
        },
        high: {
          value: high,
          label: formatCents(high),
        },
        low: {
          value: low,
          label: formatCents(low),
        },
        close: {
          value: close,
          label: formatCents(close),
        },
        volume: {
          value: volume,
          label: (volume / 1000).toFixed(2) + `K`,
        },
      },
    };
  }, {});
};

export const calculatePriceDistance = (price, { lastTrade, buyYes }) => {
  if (!price) return 'N/A';
  const value = round(((lastTrade || buyYes) - price) * 100, 2);
  const direction = value === 0 ? '' : value > 0 ? '+' : '-';
  const label = Math.abs(value).toFixed(1);
  return { label, direction };
};

export const calculateVolumeDistance = (volume, totalSharesTraded) => {
  const percentage = (volume / totalSharesTraded) * 100;
  const label = percentage.toFixed(2) + '%';
  return { label, direction: '' };
};
