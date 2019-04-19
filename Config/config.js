import firebase from "firebase";

//     Initialize Firebase
const config = {
  apiKey: "AIzaSyBJH5tcc1cqoS_RGZpbj1vhTCS7LNYXJgc",
  authDomain: "photo-feed-5f17f.firebaseapp.com",
  databaseURL: "https://photo-feed-5f17f.firebaseio.com",
  projectId: "photo-feed-5f17f",
  storageBucket: "photo-feed-5f17f.appspot.com",
  messagingSenderId: "439311150587"
};

firebase.initializeApp(config);

export const f = firebase;
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
