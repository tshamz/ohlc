import React, { Profiler } from 'react';
import { render } from 'react-dom';

import { $ } from '@shared/utils';

import { App } from '@components/App';

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
  };

  const observer = new MutationObserver(handler);

  observer.observe($.marketDetail, { childList: true, subtree: true });
};

export const mountApp = (data) => {
  if (!$.ohlcAppRoot) {
    const appEntry = document.createElement('div');
    appEntry.setAttribute('id', 'ohlc-app-root');
    document.body.appendChild(appEntry);
  }

  const callback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
  ) => {
    // console.log({
    //   id,
    //   phase,
    //   actualDuration,
    //   baseDuration,
    //   startTime,
    //   commitTime,
    //   interactions,
    // });
  };

  render(
    <>
      <Profiler id="app" onRender={callback}>
        <App {...data} />
      </Profiler>
    </>,
    $.ohlcAppRoot
  );
};
