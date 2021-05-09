import React from 'react';
import ReactDOM from 'react-dom';

import * as log from '@shared/log';
import * as storage from '@shared/storage';

import { App } from '@components/App';

const observers = {};

const $ = {
  get appRoot() {
    return document.querySelector(`.app-layout-old__content`);
  },
  get ohlcAppRoot() {
    return document.getElementById('ohlc-app-root');
  },
  get marketDetail() {
    return document.querySelector('.market-detail');
  },
  get contractRows() {
    return document.querySelectorAll(`[data-contract-id]`);
  },
  get showMoreToggle() {
    return document.querySelector(
      `.market-detail__contracts-toggle-more:not(.market-detail__contracts-toggle-more--active)`
    );
  },
};

const containsClassOrAttribute = (classNameOrAttribute) => (nodes) => {
  return nodes.some(
    (node) =>
      node.hasAttribute(classNameOrAttribute) ||
      node.classList.contains(classNameOrAttribute)
  );
};

const getAddedNodes = (mutations) => {
  return mutations
    .map((mutation) => Array.from(mutation.addedNodes))
    .flat()
    .filter((node) => node.nodeType === 1);
};

const getRemovedNodes = (mutations) => {
  return mutations
    .map((mutation) => Array.from(mutation.removedNodes))
    .flat()
    .filter((node) => node.nodeType === 1);
};

export const watchForAddedOrRemovedNodes = async (id) => {
  const observer = new MutationObserver((mutations) => {
    const addedNodes = getAddedNodes(mutations);
    const hasContractRow = containsClassOrAttribute('data-contract-id');

    if (hasContractRow(addedNodes)) {
      renderComponents();
    }
  });

  observer.observe($.marketDetail, { childList: true, subtree: true });
  observers[id] = observer;
};

export const waitForUIUpdate = (id) => {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutations, observer) => {
      if ($.contractRows.length > 0) {
        $.showMoreToggle && $.showMoreToggle.click();
        observer.disconnect();
        resolve($.contractRows);
      }
    });

    observer.observe($.appRoot, { subtree: true, childList: true });
    observers[id] = observer;
  });
};

export const renderComponents = (initial = {}) => {
  log.event.lifecycle('before.mount')(initial);

  if (!$.ohlcAppRoot) {
    const appEntry = document.createElement('div');
    appEntry.setAttribute('id', 'ohlc-app-root');
    document.body.appendChild(appEntry);
  }

  ReactDOM.render(<App {...initial} />, $.ohlcAppRoot);
};

export const unmountComponents = async (id) => {
  log.event.lifecycle('before.unmount')({ id });

  await storage.observers
    .get(({ [id]: observer }) => observer || {})
    .then((observer) => observer.disconnect && observer.disconnect());

  ReactDOM.unmountComponentAtNode($.ohlcAppRoot);
};
