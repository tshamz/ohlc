import { init, onMarketEnter, onMarketExit } from './modules/events';

window.addEventListener('marketenter', onMarketEnter);
window.addEventListener('marketexit', onMarketExit);

init();

(function injectScript() {
  const file = chrome.runtime.getURL('inject.js');
  const th = document.getElementsByTagName('body')[0];
  const s = document.createElement('script');

  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', file);
  th.appendChild(s);
})();
