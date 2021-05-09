import ansicolor from 'ansicolor';

import * as CONST from '@shared/const';

const {
  parse,
  bright,
  bgBlack,
  bgLightBlue,
  bgLightGray,
  bgLightGreen,
  bgLightRed,
  bgLightYellow,
} = ansicolor;

const colors = {
  default: bgLightGray,

  init: bgLightGray,
  mount: bgLightGreen,
  unmount: bgLightRed,
  firebase: bgLightYellow,
  lifecycle: bgBlack,
  navigation: bgLightBlue,

  [CONST.MARKET_ENTER]: bgLightYellow,
  [CONST.MARKET_READY]: bgLightGreen,
  [CONST.MARKET_EXIT]: bgLightRed,

  [CONST.RESET_STATE]: bgLightRed,
  [CONST.START_EXTENSION]: bgLightGreen,
  [CONST.BEFORE_MOUNT]: bgLightYellow,
  [CONST.BEFORE_UNMOUNT]: bgLightYellow,

  [CONST.MARKETS_GET]: bgLightRed,
  [CONST.MARKET_GET]: bgLightGreen,
  [CONST.MARKET_CONTRACTS_GET]: bgLightGreen,
  [CONST.MARKET_PRICES_GET]: bgLightGreen,
  [CONST.MARKET_PRICES_SUBSCRIBE]: bgLightYellow,
  [CONST.MARKET_PRICES_UNSUBSCRIBE]: bgLightGreen,

  [CONST.CONTRACTS_GET]: bgLightRed,

  [CONST.TIMESPANS_SUBSCRIBE]: bgLightRed,
  [CONST.TIMESPANS_UNSUBSCRIBE]: bgLightGreen,
};

const color = (value) => colors[value] || colors.default;
const style = (value) => color(value).white(` ${value} `);
const pad = (value, size) => ' '.repeat(Math.max(0, size - value.length));

const logEvent = (type) => (event) => async (data = {}) => {
  const timestamp = new Date().toLocaleString().padEnd(25);
  const typeValue = `Type: ${style(type)} ${pad(type, 10)}`;
  const eventValue = `Event: ${style(event)} ${pad(event, 20)}`;
  const message = bright(`${timestamp} ${typeValue} ${eventValue} Data:`);

  console.log(...parse(message).asChromeConsoleLogArguments, { $: data });

  return data;
};

export const event = {
  init: logEvent('init'),
  firebase: logEvent('firebase'),
  lifecycle: logEvent('lifecycle'),
  navigation: logEvent('navigation'),
};

// export const log = ololog
//   .configure({
//     time: {
//       yes: true,
//       format: 'locale',
//       locale: 'en-US',
//       print: (x) => String(x.toLocaleString()).padEnd(25).bright,
//     },
//     locate: false,
//   })
//   .methods({
//     // get price() {
//     //   return this.configure({
//     //     '+stringify': (args) => {
//     //       const [market, contract, difference] = args;
//     //       const { path, lhs, rhs } = difference;
//     //       const change = Math.abs(rhs - lhs).toFixed(2);
//     //       const direction = rhs - lhs > 0 ? `↑`.green : `↓`.red;
//     //       const formatKey = (key) => ansicolor.dim.italic(key);
//     //       const formatValue = (value) => ansicolor.bright(value);

//     //       return [
//     //         ansicolor.bright.lightGreen(`price updated`),
//     //         {
//     //           [formatKey(`market`)]: formatValue(market.shortName),
//     //           [formatKey(`contract`)]: formatValue(contract.shortName),
//     //           [formatKey(`price`)]: formatValue(path[0]),
//     //           [formatKey(`value`)]: formatValue(rhs),
//     //           [formatKey(`change`)]: formatValue(change) + direction,
//     //         },
//     //       ];
//     //     },
//     //   });
//     // },
//     // log.event({ type: 'lifecycle', name: 'mount', component: 'OHLC' });
//     get event() {
//       return this.configure({
//         '+stringify': ([{ type, name }]) => {
//           return [
//             `Type: ${stylize(type)}`.bright,
//             ' '.repeat(15 - type.length),
//             `Event: ${stylize(name)}`.bright,
//             ' '.repeat(15 - name.length),
//           ];
//         },
//         // '+concat': (args) => {
//         //   const [event, color, text] = args[0];
//         //   return [[createLabel(event, makeLight(color)), text]];
//         //   // return [[createLabel(args[0][0], makeLight(args[0][1])), args[0][2]]];
//         // },X
//         render: (text, { initialArguments: [{ type, name, ...meta }] }) => {
//           const message = ansicolor.parse(text).asChromeConsoleLogArguments;
//           console.log(...message, meta);
//           // const last = args[args.length - 1];

//           // if (typeof last === 'object') {
//           //   message[0] = message[0].padEnd(50);
//           //   console.log(...message, last);
//           //   return;
//           // }
//           // return typeof args[args.length - 1] === 'object'
//           //   ? console.log(...ansicolor.parse(text).asChromeConsoleLogArguments, last)
//           //   : console.log(...ansicolor.parse(text).asChromeConsoleLogArguments);
//         },
//       });
//       // return this.configure({
//       //   // '+stringify': (args) => {
//       //   //   const { type, name } = args[0];
//       //   //   args[0].type = stylize(type);
//       //   //   args[0].name = stylize(name);

//       //   //   return typeof args[1] === 'object' ? args.slice(0, -1) : args;
//       //   // },
//       //   // stringify: { pretty: false },
//       //   // '+concat': (args) => {
//       //   //   const [event, color, text] = args[0];
//       //   //   return [[createLabel(event, makeLight(color)), text]];
//       //   //   // return [[createLabel(args[0][0], makeLight(args[0][1])), args[0][2]]];
//       //   // },
//       //   render: (text, { initialArguments: [, metadata] }) => {
//       //     // const last = args[args.length - 1];
//       //     const message = ansicolor.parse(text).asChromeConsoleLogArguments;

//       //     if (metadata) {
//       //       // message[0] = message[0].padEnd(50);
//       //       console.log(...message, 'data: ', metadata);
//       //       return;
//       //     }
//       //     console.log(...message);
//       //     // return typeof args[args.length - 1] === 'object'
//       //     //   ? console.log(...ansicolor.parse(text).asChromeConsoleLogArguments, last)
//       //     //   : console.log(...ansicolor.parse(text).asChromeConsoleLogArguments);
//       //   },
//       // });
//     },
//   });

// // export default log;
