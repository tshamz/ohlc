(function historyEvents() {
  const dispatchMarketEvents = ({ current, previous, browserEvent }) => {
    const enteringMarket = current && current.includes('markets/detail');
    const exitingMarket = previous && previous.includes('markets/detail');

    if (exitingMarket) {
      const id = previous.replace(/.*\/detail\/(\d\d\d\d\d?)\/?.*/, '$1');
      const event = new CustomEvent('market.exit', { detail: id });
      window.dispatchEvent(event);
    }

    if (enteringMarket) {
      const id = current.replace(/.*\/detail\/(\d\d\d\d\d?)\/?.*/, '$1');
      const event = new CustomEvent('market.enter', { detail: id });
      window.dispatchEvent(event);
    }

    if (browserEvent) {
      window.dispatchEvent(new Event(browserEvent));
    }
  };

  window.addEventListener('load', (event) => {
    if (window.location.pathname.includes(`detail/`)) {
      dispatchMarketEvents({ current: window.location.pathname });
    }
  });

  window.history.pushState = ((fn) => {
    return function pushState() {
      const previous = `${window.location.pathname}`;
      const _return = fn.apply(this, arguments);
      const current = `${window.location.pathname}`;
      dispatchMarketEvents({ current, previous, browserEvent: 'pushstate' });
      return _return;
    };
  })(window.history.pushState);

  window.history.replaceState = ((fn) => {
    return function replaceState() {
      const previous = `${window.location.pathname}`;
      const _return = fn.apply(this, arguments);
      const current = `${window.location.pathname}`;
      dispatchMarketEvents({ current, previous, browserEvent: 'replacestate' });
      return _return;
    };
  })(window.history.replaceState);

  // window.addEventListener('popstate', () => {});
})();

(function websocketWrapper() {
  let OrigWebSocket = window.WebSocket;
  let callWebSocket = OrigWebSocket.apply.bind(OrigWebSocket);
  let wsAddListener = OrigWebSocket.prototype.addEventListener;
  wsAddListener = wsAddListener.call.bind(wsAddListener);

  window.WebSocket = function WebSocket(url, protocols) {
    let ws;

    if (!(this instanceof WebSocket)) {
      ws = callWebSocket(this, arguments);
    } else if (arguments.length === 1) {
      ws = new OrigWebSocket(url);
    } else if (arguments.length >= 2) {
      ws = new OrigWebSocket(url, protocols);
    } else {
      ws = new OrigWebSocket();
    }

    wsAddListener(ws, 'message', function (event) {
      if (event.data.length <= 2) return;

      if (event.origin === 'wss://hub.predictit.org') {
        const eventNameMap = {
          accountfunds_data: 'accountFunds.data',
          market_data: 'market.data',
          market_status: 'market.status',
          marketOwnershipUpdate_data: 'market.ownership',
          contractOwnershipUpdate_data: 'contract.ownership',
          contract_data: 'contract.data',
          tradeConfirmed_data: 'trade.confirmed',
          notification_shares_traded: 'notification.sharesTraded',
          notification_trade_level_changed: 'notification.tradeLevelChanged',
        };

        const messages = JSON.parse(event.data).M.map(({ A }) => A);

        messages.forEach(([type, data]) => {
          const detail = { data };
          const event = new CustomEvent(eventNameMap[type], { detail });
          window.dispatchEvent(event);
        });
      }
    });

    return ws;
  }.bind();

  window.WebSocket.prototype = OrigWebSocket.prototype;
  window.WebSocket.prototype.constructor = window.WebSocket;

  let wsSend = OrigWebSocket.prototype.send;
  wsSend = wsSend.apply.bind(wsSend);

  OrigWebSocket.prototype.send = function (data) {
    // TODO: Do something with the sent data if you wish.
    return wsSend(this, arguments);
  };
})();
