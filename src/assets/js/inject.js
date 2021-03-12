(function script() {
  const dispatchMarketEvents = (previous, current) => {
    try {
      const leavingMarket = previous.includes('markets/detail');
      const enteringMarket = current.includes('markets/detail');

      if (leavingMarket) {
        window.dispatchEvent(
          new CustomEvent('marketexit', {
            detail: previous.replace(/.*\/detail\/(\d\d\d\d\d?)\/?.*/, '$1'),
          })
        );
      }

      if (enteringMarket) {
        window.dispatchEvent(
          new CustomEvent('marketenter', {
            detail: current.replace(/.*\/detail\/(\d\d\d\d\d?)\/?.*/, '$1'),
          })
        );
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  window.history.pushState = ((fn) => {
    return function pushState() {
      const previous = `${window.location.pathname}`;
      const ret = fn.apply(this, arguments);
      const current = `${window.location.pathname}`;
      dispatchMarketEvents(previous, current);
      window.dispatchEvent(new Event('pushstate'));
      return ret;
    };
  })(window.history.pushState);

  window.history.replaceState = ((fn) => {
    return function replaceState() {
      const previous = `${window.location.pathname}`;
      const ret = fn.apply(this, arguments);
      const current = `${window.location.pathname}`;
      dispatchMarketEvents(previous, current);
      window.dispatchEvent(new Event('replacestate'));
      return ret;
    };
  })(window.history.replaceState);

  // window.addEventListener('popstate', () => {});
})();
