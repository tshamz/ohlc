import { log, logError } from './log.js';
import { toStorage, fromStorage, expires, isExpired } from './utils.js';

export const PREDICTIT_DOT_ORG = `https://www.predictit.org`;

const requests = {};

export const _fetch = new Proxy(window.fetch, {
  apply: function (target, thisArg, args) {
    log(`intercepted fetch!`.white.bgLightRed);

    const url = args[0];
    const options = args[1] || {};

    if (!requests[url] || isExpired(requests[url]) || options.force) {
      log(`requesting: `.lightRed, `${url}`.italic);

      requests[url] = target.apply(thisArg, [url, options]);
      requests[url]._expires = expires.tenMinutes;
      requests[url].catch(() => delete requests[url]);
    }

    return requests[url].then((response) => response.clone());
  },
});

export const fetchJson = (...args) => {
  return _fetch(...args)
    .then((response) => response.json())
    .catch(logError);
};

export const fetchText = (...args) => {
  return _fetch(...args)
    .then((response) => response.text())
    .catch(logError);
};

export const fetchPositions = async ({ force = false } = {}) => {
  try {
    const { positions } = await fromStorage('positions');
    console.log('positions1', positions);

    if (!positions || isExpired(positions) || force) {
      const token = JSON.parse(window.localStorage.getItem('token'))?.value;
      const url = `${PREDICTIT_DOT_ORG}/api/Profile/Shares`;
      const headers = { Authorization: `Bearer ${token}` };
      const positions = await fetchJson(url, { headers }, { force });

      positions._expires = expires.hour;

      await toStorage('positions', { positions });

      return positions;
    }

    return positions;
  } catch (error) {
    await toStorage('positions', null);
    console.log('error', error);
  }
};

// const token = JSON.parse(window.localStorage.getItem('token'))?.value;

// if (token) {
//   chrome.runtime.sendMessage({ type: 'token', message: token });
// } else {
//   chrome.runtime.sendMessage({ type: 'token', message: null });
// }
