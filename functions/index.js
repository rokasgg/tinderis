const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");

admin.initializeApp();

const dbase = admin.firestore().collection("messages");

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.sendTextMes = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(401).json({ messages: "Not allowed" });
    }
    console.log("Requistas", req.body);
    const item = req.body.item;
    const userId = req.body.userId;
    dbase.add({ userId: userId, textMessage: item });
  });
});
exports.addItem = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(401).json({
        message: "Not allowed",
      });
    }
    console.log(req.query);

    const item = req.query.item;

    dbase.push({ item });

    let items = [];

    return dbase.on(
      "value",
      (snapshot) => {
        snapshot.forEach((item) => {
          items.push({
            id: item.key,
            items: item.val().item,
          });
        });

        res.status(200).json(items);
      },
      (error) => {
        res.status(error.code).json({
          message: `Something went wrong. ${error.message}`,
        });
      }
    );
  });
});
