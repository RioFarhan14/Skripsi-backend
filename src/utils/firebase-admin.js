import admin from "firebase-admin";
import serviceAccount from "./booking-app-skripsi-firebase-adminsdk-i7qv9-6abf9edbcc.json" assert { type: "json" };
import { logger } from "../application/logging.js";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to send a push notification
async function sendPushNotification(token, title, message, notification_id) {
  try {
    const response = await admin.messaging().send({
      token: token,
      notification: {
        title: title,
        body: message,
      },
      data: {
        notification_id: String(notification_id),
      },
    });
    logger.info("Successfully sent message:", response);
  } catch (error) {
    logger.info("Error sending message:", error);
  }
}

async function sendPushNotificationAll(title, message, notification_id) {
  try {
    const response = await admin.messaging().send({
      topic: "general",
      notification: {
        title: title,
        body: message,
      },
      data: {
        notification_id: String(notification_id),
      },
    });
    logger.info("Successfully sent message:", response);
  } catch (error) {
    logger.info("Error sending message:", error);
  }
}

// Export the functions correctly
export { sendPushNotification, sendPushNotificationAll };
