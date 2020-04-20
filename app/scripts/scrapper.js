const admin = require("firebase-admin")
const serviceAccount = require("../scripts/service.json")
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://uiet-mdu-bc58d.firebaseio.com"
})
const sendMsg = function sendNotification(title, body, link) {

    const registrationToken = 'fOMqeAI7L20:APA91bEYtnY-mshByqGEWIOwJW78vGHOW8C2oQSVAshXfy6ypscpE_msdjO1ETE1ge3o9po2Jv3HDPs2BdqMSQCs2QNNwM1ItIWs0bulJKIDt1tYeCMpWcBO_0i1I03Ou7owtkaRmJr6'

    const payload = {
        notification: {
            title: title,
            body: body
        },
        data: {
            link: link
        }
    };

    const options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };

    admin.messaging().sendToDevice(registrationToken, payload, options)
        .then(function (response) {
            console.log("Successfully sent message:", response);
        })
        .catch(function (error) {
            console.log("Error sending message:", error);
        });

}

module.exports = sendMsg