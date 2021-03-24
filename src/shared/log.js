import ololog from 'ololog';
import ansicolor from 'ansicolor';

const noop = ansicolor.nice;

export const log = ololog
  .configure({
    time: {
      yes: true,
      format: 'locale',
      locale: 'en-US',
      print: (x) => String(x.toLocaleString()).padEnd(25).bright,
    },
    locate: false,
  })
  .methods({
    get price() {
      return this.configure({
        '+stringify': (args) => {
          const [market, contract, difference] = args;
          const { path, lhs, rhs } = difference;
          const change = Math.abs(rhs - lhs).toFixed(2);
          const direction = rhs - lhs > 0 ? `↑`.green : `↓`.red;
          const formatKey = (key) => ansicolor.dim.italic(key);
          const formatValue = (value) => ansicolor.bright(value);

          return [
            ansicolor.bright.lightGreen(`price updated`),
            {
              [formatKey(`market`)]: formatValue(market.shortName),
              [formatKey(`contract`)]: formatValue(contract.shortName),
              [formatKey(`price`)]: formatValue(path[0]),
              [formatKey(`value`)]: formatValue(rhs),
              [formatKey(`change`)]: formatValue(change) + direction,
            },
          ];
        },
      });
    },
  });

export const logError = (error) => {
  log.bright.red(error);
  throw error;
};

export default log;
