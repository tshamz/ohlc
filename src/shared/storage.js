import chalk from 'chalk';
import diffler from 'diffler';
import { storage, getBucket } from '@extend-chrome/storage';

export const sync = storage.sync;
export const local = storage.local;

export const active = getBucket('active');
export const lastRan = getBucket('lastRan');

export const markets = getBucket('markets');
export const contracts = getBucket('contracts');
export const prices = getBucket('prices');
export const timespans = getBucket('timespans');

markets.name = 'markets';
contracts.name = 'contracts';
prices.name = 'prices';
timespans.name = 'timespans';

markets.changeStream.subscribe((changes) => {
  // console.log(`markets changes`, changes);
});

contracts.changeStream.subscribe((changes) => {
  // console.log(`contracts changes`, changes);
});

active.changeStream.subscribe((changes) => {
  // console.log(`active changes`, changes);
});

const logChanges = (title) => (changes) => {
  setTimeout(() => {
    console.groupCollapsed(chalk.black.bold(title));

    Object.entries(changes).forEach(([key, value], index) => {
      const { oldValue = {}, newValue = {} } = value;

      index === 0
        ? console.group(chalk.black.bold(key))
        : console.groupCollapsed(chalk.black.bold(key));

      console.table(diffler(oldValue, newValue));

      console.groupEnd();
    });

    console.groupEnd();
  }, 2500);
};

// setTimeout(() => {
//   console.groupCollapsed(chalk.black.bold('changes:markets'));

//   Object.entries(changes).forEach(([key, value], index) => {
//     const { oldValue = {}, newValue = {} } = value;

//     index === 0
//       ? console.group(chalk.black.bold(key))
//       : console.groupCollapsed(chalk.black.bold(key));

//     console.table(diffler(oldValue, newValue));

//     console.groupEnd();
//   });

//   console.groupEnd();
// }, 2500);
