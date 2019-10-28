const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const uuidv5 = require("uuid/v5");

admin.initializeApp();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/", (req, res) => {
  const users = req.body;

  return admin
    .database()
    .ref("/users")
    .push(users)
    .then(() => res.status(200).send("successful"))
    .catch(err => {
      console.error(err);
      return res.status(500).send("failed");
    });
});

exports.users = functions.https.onRequest(app);

// const postId = admin
//   .database()
//   .ref("/users")
//   .push().key;

exports.addUserId = functions.database
  .ref("/users/{usersId}")
  .onCreate((snapshot, context) => {
    const pushId = context.params.usersId;
    // const NAMESPACE = `256eeca98fa1348090565a`;
    const uuid = uuidv5(
      `https://enye-app.firebaseapp.com/${pushId}`,
      uuidv5.URL
    );

    return snapshot.ref.update({ userId: uuid });
    // return snapshot.ref.parent.child("userid").update({ userId });
  });
