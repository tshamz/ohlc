import ololog from 'ololog';
import ansicolor from 'ansicolor';

import { DEBUG } from './constants';

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
    get quiet() {
      return this.configure({ render: DEBUG });
    },
    get event() {
      return this.configure({
        '+stringify': (args, config) => {
          return args.map((arg, index) => {
            return typeof arg === 'string'
              ? ansicolor.white.bgLightYellow.bright(arg)
              : arg;
          });
        },
      });
    },
    get good() {
      return this.configure({
        '+stringify': (args, config) => {
          return args.map((arg, index) => {
            return typeof arg === 'string'
              ? ansicolor.lightGreen.bright(arg)
              : arg;
          });
        },
      });
    },
    get bad() {
      return this.configure({
        '+stringify': (args, config) => {
          return args.map((arg, index) => {
            return typeof arg === 'string'
              ? ansicolor.lightRed.bright(arg)
              : arg;
          });
        },
      });
    },
    get bgGood() {
      return this.configure({
        '+stringify': (args, config) => {
          return args.map((arg, index) => {
            return typeof arg === 'string'
              ? ansicolor.bgLightGreen.bright(arg)
              : arg;
          });
        },
      });
    },
    get bgBad() {
      return this.configure({
        '+stringify': (args, config) => {
          return args.map((arg, index) => {
            return typeof arg === 'string'
              ? ansicolor.bgLightRed.bright(arg)
              : arg;
          });
        },
      });
    },
  });

export const logError = log.bright.red;

export default log;
