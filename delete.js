var admin = require("firebase-admin");
var fs = require("fs");

var serviceAccount = require("./playtech-f270d-firebase-adminsdk-gkahj-cbddf16514.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://playtech-f270d.firebaseio.com",
});

const data = fs.readFileSync("users_final.json");
const users = JSON.parse(data);
const db = admin.firestore();
function deleteUser(uid) {
  admin
    .auth()
    .deleteUser(uid)
    .then(function () {
      console.log("Successfully deleted user", uid);
    })
    .catch(function (error) {
      console.log("Error deleting user:", error);
    });
}

function getAllUsers(nextPageToken) {
  admin
    .auth()
    .listUsers(600, nextPageToken)
    .then(function (listUsersResult) {
      listUsersResult.users.forEach(function (userRecord) {
        uid = userRecord.toJSON().uid;
        deleteUser(uid);
      });
      if (listUsersResult.pageToken) {
        getAllUsers(listUsersResult.pageToken);
      }
    })
    .catch(function (error) {
      console.log("Error listing users:", error);
    });
}

getAllUsers();
