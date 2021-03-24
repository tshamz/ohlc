try {
  let previous = null;

  const onNav = ({ tabId, url: current, ...args }) => {
    const exitingMarket = previous?.includes('markets/detail');
    const enteringMarket = current.includes('markets/detail');
    const id = current.match(/detail\/(?<id>\d\d\d\d\d?)/)?.groups.id;

    if (enteringMarket) {
      // chrome.tabs.sendMessage(tabId, {
      //   id: parseInt(id),
      //   type: 'navigation',
      //   event: 'market.enter',
      // });
    }

    if (exitingMarket && !enteringMarket) {
      // chrome.tabs.sendMessage(tabId, {
      //   id: null,
      //   type: 'navigation',
      //   event: 'market.exit',
      // });
    }

    previous = current;
  };

  const predictitOnly = {
    url: [{ hostContains: '.predictit' }],
  };

  chrome.webNavigation.onHistoryStateUpdated.addListener(onNav, predictitOnly);
} catch (error) {
  console.error(error);
}
