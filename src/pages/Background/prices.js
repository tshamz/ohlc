import * as storage from '@shared/storage';
import * as messages from '@shared/messages';
import * as firebase from '@shared/firebase';

try {
  const onPriceChange = (snapshot) =>
    storage.active.set({ prices: snapshot.val() });

  const onMarketEnter = async ([id]) =>
    firebase.subscribeToMarketPriceUpdates(id, onPriceChange);

  const onMarketExit = ([id]) =>
    firebase.unsubscribeToMarketPriceUpdates(id, onPriceChange);

  messages.pricesSubscribeStream.subscribe(onMarketEnter);
  messages.pricesUnsubscribeStream.subscribe(onMarketExit);
} catch (error) {
  console.error(error);
}
