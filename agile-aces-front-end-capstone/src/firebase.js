import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyA1CbcXLhZnzuP9x1dQvZyDt3vU7sQrBuY",
    authDomain: "teach-me-more.firebaseapp.com",
    databaseURL: "https://teach-me-more.firebaseio.com",
    projectId: "teach-me-more",
    storageBucket: "teach-me-more.appspot.com",
    messagingSenderId: "360962939029"
};

// var config = {
//   apiKey: "AIzaSyAR4pLWCpiO0cniwDQs7uoPOg4TzScbagY",
//   authDomain: "teach-me-more-backup.firebaseapp.com",
//   databaseURL: "https://teach-me-more-backup.firebaseio.com",
//   projectId: "teach-me-more-backup",
//   storageBucket: "teach-me-more-backup.appspot.com",
//   messagingSenderId: "580046812098"
// }


// var config = {
//   apiKey: "AIzaSyAR4pLWCpiO0cniwDQs7uoPOg4TzScbagY",
//   authDomain: "teach-me-more-backup.firebaseapp.com",
//   databaseURL: "https://teach-me-more-backup.firebaseio.com",
//   projectId: "teach-me-more-backup",
//   storageBucket: "teach-me-more-backup.appspot.com",
//   messagingSenderId: "580046812098"
// }

//Michael's database
// var config = {
//   apiKey: "AIzaSyDgHqLrrMwHmappWrkYZZHi5XY5-Vi7pG4",
//   authDomain: "my-test-bff78.firebaseapp.com",
//   databaseURL: "https://my-test-bff78.firebaseio.com",
//   projectId: "my-test-bff78",
//   storageBucket: "my-test-bff78.appspot.com",
//   messagingSenderId: "836597006606"
// };

firebase.initializeApp(config);
const users = firebase.firestore().collection("users");
const classes = firebase.firestore().collection("classes");
const topics = firebase.firestore().collection("topics");

export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const facebookProvider = new firebase.auth.FacebookAuthProvider();
export const auth = firebase.auth();
export { users, classes, topics };
export default firebase;
