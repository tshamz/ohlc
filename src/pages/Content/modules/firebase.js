import firebase from 'firebase/app';
import 'firebase/database';

export const app = firebase.initializeApp({
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

export const db = {
  app: firebase.database(app),
  timespans: firebase.database(timespans),
};

export const fetchPathOnce = (path, database = db.app) => {
  return database
    .ref(path)
    .once('value')
    .then((snapshot) => snapshot.val());
};

export const fetchPath = (path, database = db.app) => {
  return database.ref(path);
};
