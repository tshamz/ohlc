import React from 'react';
import { render } from 'react-dom';

import { dom } from './utils';
import log, { logError } from './log.js';
import { OpenHighLowClose } from '../../../containers/OpenHighLowClose';

export const mountReactApps = async (market) => {
  console.log('market');
  const apps = market?.contracts.map((contract, index) => {
    const rowIndex = contract.displayOrder || index;
    const id = `ohlc-react-root-${rowIndex}`;
    const $row = dom.contractRows.item(rowIndex);
    const hasContainer = document.getElementById(id);

    if (hasContainer) return;

    const $sibling = $row.children[1];
    const $node = document.createElement('div');

    $node.id = id;
    $node.classList.add('ohlc-root');
    $node.setAttribute('data-index', index);
    $node.setAttribute('data-contract', contract.id);

    $row.insertBefore($node, $sibling);

    const app = render(
      <OpenHighLowClose className="ohlc" market={market} contract={contract} />,
      $node
    );

    return [app, $node];
  });

  return apps;
};

export const watchContractRows = async (market) => {
  const observer = new MutationObserver((mutations) => {
    if (market.contracts.length !== dom.ohlcContainers.length) {
      mountReactApps(market);
    }
  });

  observer.observe(dom.contractsContainer, { childList: true });
};
