const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

exports.createUserDoc = functions.auth.user().onCreate((user) => {
  const userDoc = {
    uid: user.uid,
    displayName: "",
    language: "",
    storiesStarted: [],
    storiesParticipant: [],
    storiesOpen: [],
    lastLogIn: new Date(),
    friends: [],
    points: 0,
    achievements: [],
  };

  admin
    .firestore()
    .collection("users")
    .doc(user.uid)
    .set(userDoc)
    .then((res) => {
      console.log(`Document written at ${res.updateTime} for ${user.uid}`);
    });
});

// TODO record last user log in into user data
