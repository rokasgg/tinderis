import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAiIIMTJYEggbRVXGv6jKhkreJ_5N95Dwo",
  authDomain: "tinderis.firebaseapp.com",
  databaseURL: "https://tinderis.firebaseio.com",
  projectId: "tinderis",
  storageBucket: "tinderis.appspot.com",
  messagingSenderId: "903734096713",
  appId: "1:903734096713:web:44460085f479dc9152a098",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const usersDb = firebase.firestore().collection("users");
export const dbase = firebase.firestore().collection("messages");
export const dbaseGetMessages = firebase.firestore().collection("messages");
