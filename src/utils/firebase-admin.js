import admin from "firebase-admin";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require("./booking-app-skripsi-firebase-adminsdk-i7qv9-d1d6be4049.json");
import { logger } from "../application/logging.js";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to send a push notification
export async function sendPushNotification(
  token,
  title,
  message,
  notification_id
) {
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

export async function sendPushNotificationAll(title, message, notification_id) {
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
