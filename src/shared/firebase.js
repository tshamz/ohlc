import firebase from 'firebase/app';
import 'firebase/database';

firebase.initializeApp({
  apiKey: 'AIzaSyCsS6Um6Op2Ps6H8fuoWklX1WMB5-hUhq4',
  authDomain: 'pav2tty5lo7geycf.firebaseapp.com',
  databaseURL: 'https://pav2tty5lo7geycf-default-rtdb.firebaseio.com',
  projectId: 'pav2tty5lo7geycf',
  storageBucket: 'pav2tty5lo7geycf.appspot.com',
  messagingSenderId: '469624002805',
  appId: '1:469624002805:web:561bd21a3d6e50acce4dbc',
});

const timespans = firebase.initializeApp(
  {
    apiKey: 'AIzaSyCsS6Um6Op2Ps6H8fuoWklX1WMB5-hUhq4',
    authDomain: 'pav2tty5lo7geycf.firebaseapp.com',
    databaseURL: 'https://pav2tty5lo7geycf-timespans.firebaseio.com',
    projectId: 'pav2tty5lo7geycf',
    storageBucket: 'pav2tty5lo7geycf.appspot.com',
    messagingSenderId: '469624002805',
    appId: '1:469624002805:web:561bd21a3d6e50acce4dbc',
  },
  'timespans'
);

export const marketsRef = firebase.app().database().ref('markets');
export const contractsRef = firebase.app().database().ref('contracts');
export const pricesRef = firebase.app().database().ref('prices');

// uncommenting the following causes the service worker to not start
// export const timespansRef = firebase.app(timespans).database().ref();

export const getRef = async (path) => {
  return firebase.app().database().ref(path);
};

export const getMarketRef = (id) => {
  return firebase.app().database().ref('markets').child(id);
};

export const getMarketContractRefs = (id) => {
  return contractsRef.orderByChild('market').equalTo(id);
};

export { firebase };
