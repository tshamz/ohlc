import React from 'react';
import { render } from 'react-dom';

import { App } from '@components/App';

import { $ } from '@shared/utils';
import { fetchMarketData } from '@shared/fetch';

const containsClass = (nodes) => (classNames) => {
  const nodeHasAllClassNames = (node) => {
    return [classNames]
      .flat()
      .every((className) => node.classList.contains(className));
  };

  return nodes.some(nodeHasAllClassNames);
};

const getNodes = (mutations) => (type) => {
  const nodes = mutations
    .map((mutation) => Array.from(mutation[type]))
    .flat()
    .filter((node) => node.nodeType === 1);

  nodes.contains = containsClass(nodes);

  return nodes;
};

export const watchForMarketReady = () => {
  return new Promise((resolve) => {
    const handler = async (mutations, observer) => {
      if ($.contracts.length > 0) {
        $.showMoreToggle && $.showMoreToggle.click();
        observer.disconnect();
        resolve();
      }
    };

    const contractsObserver = new MutationObserver(handler);

    contractsObserver.observe($.appRoot, { subtree: true, childList: true });
  });
};

export const watchForAddedOrRemovedNodes = async () => {
  const handler = (mutations) => {
    const nodes = getNodes(mutations);
    const addedNodes = nodes('addedNodes');
    const removedNodes = nodes('removedNodes');

    if (addedNodes.contains('market-contract-horizontal-v2')) {
      mountApp();
    }

    if (addedNodes.contains('market-payout--market')) {
      window.dispatchEvent(new CustomEvent('payoutNode.added'));
    }
  };

  if (!$.marketDetail) {
    setTimeout(watchForAddedOrRemovedNodes, 5000);
  } else {
    const observer = new MutationObserver(handler);

    observer.observe($.marketDetail, { childList: true, subtree: true });
  }
};

export const mountApp = async () => {
  const path = window.location.pathname;
  const id = path.match(/detail\/(?<id>\d\d\d\d\d?)/)?.groups.id;

  if (!id) return;

  // const data = await fetchMarketData(id);

  if (!$.ohlcAppRoot) {
    const appEntry = document.createElement('div');
    appEntry.setAttribute('id', 'ohlc-app-root');
    document.body.appendChild(appEntry);
  }

  render(<App />, $.ohlcAppRoot);
};
