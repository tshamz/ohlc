import { init } from './modules/events';

init();

const injectScript = (filename) => {
  const src = chrome.runtime.getURL(filename);
  const script = document.createElement('script');
  const body = document.getElementsByTagName('body')[0];

  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', src);

  body.appendChild(script);
};

(function injectScripts() {
  injectScript('inject.js');
  // injectScript('loader.js');
})();
