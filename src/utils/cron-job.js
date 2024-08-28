import pkg from "node-schedule";
const { scheduleJob } = pkg;
import NotificationService from "../service/notification-service.js";
import { prismaClient } from "../application/database.js";
import {
  formattedDate,
  getCurrentTime,
  getDurationMinute,
  plusTime,
} from "./timeUtils.js"; // Sesuaikan path sesuai folder Anda
import { validateMembership } from "./validate.js";

// Fungsi Pemberitahuan 15 menit sebelum dimulai untuk membership
const pushNotificationMember = async () => {
  const now = getCurrentTime();
  const date = formattedDate(now, "YYYY-MM-DD");
  const time = formattedDate(now, "HH:mm");
  const timePlusFifteenMinute = plusTime(time, 15);

  try {
    // Ambil semua booking yang statusnya booked dan startTime-nya sudah tiba
    const bookingsToNotify = await prismaClient.booking.findMany({
      where: {
        status: "Booked",
        booking_date: date,
        start_time: {
          lte: timePlusFifteenMinute,
        },
        notification_sent: false,
      },
    });

    // Loop untuk setiap booking
    await Promise.all(
      bookingsToNotify.map(async (booking) => {
        try {
          const member = await validateMembership(booking.user_id, now);
          const product = await prismaClient.product.findUnique({
            where: {
              product_id: booking.product_id,
            },
            select: {
              product_name: true,
            },
          });

          if (member && product) {
            const productName = product.product_name;
            const duration = getDurationMinute(time, booking.start_time);

            const request = {
              user_id: booking.user_id,
              category_id: 1,
              title: "Booking",
              message: `Halo! Hanya tinggal ${duration} menit lagi sebelum jadwal bermain Anda di ${productName} dimulai. Ayo persiapkan diri Anda dan nikmati pengalaman yang menyenangkan!`,
            };
            // Kirim notifikasi
            await NotificationService.create(request);

            // Tandai booking sebagai notifikasi sudah dikirim
            await prismaClient.booking.update({
              where: { booking_id: booking.booking_id },
              data: { notification_sent: true },
            });
          }
        } catch (error) {
          console.error(
            `Error sending notification for booking ${booking.booking_id}:`,
            error
          );
        }
      })
    );
  } catch (error) {
    console.error("Error in pushNotificationMember function:", error);
  }
};

// Fungsi untuk memperbarui status booking
const updateBookingStatus = async () => {
  const now = getCurrentTime();
  const date = formattedDate(now, "YYYY-MM-DD");
  const time = formattedDate(now, "HH:mm");

  try {
    // Ambil semua booking yang statusnya booked dan startTime-nya sudah tiba
    const bookingsToOngoing = await prismaClient.booking.findMany({
      where: {
        status: "Booked",
        booking_date: date,
        start_time: {
          lte: time,
        },
      },
    });

    // Update status menjadi Ongoing untuk booking yang memenuhi syarat
    await Promise.all(
      bookingsToOngoing.map(async (booking) => {
        try {
          await prismaClient.booking.update({
            where: { booking_id: booking.booking_id },
            data: { status: "Ongoing" },
          });
          console.log(`Booking ${booking.booking_id} updated to Ongoing`);
        } catch (error) {
          console.error(
            `Error updating booking ${booking.booking_id} to Ongoing:`,
            error
          );
        }
      })
    );

    // Ambil semua booking yang statusnya Ongoing dan end_time-nya sudah berlalu
    const bookingsToComplete = await prismaClient.booking.findMany({
      where: {
        status: "Ongoing",
        booking_date: date,
        end_time: {
          lte: time,
        },
      },
    });

    // Update status menjadi Completed untuk booking yang memenuhi syarat
    await Promise.all(
      bookingsToComplete.map(async (booking) => {
        try {
          await prismaClient.booking.update({
            where: { booking_id: booking.booking_id },
            data: { status: "Completed" },
          });
          console.log(`Booking ${booking.booking_id} updated to Completed`);
        } catch (error) {
          console.error(
            `Error updating booking ${booking.booking_id} to Completed:`,
            error
          );
        }
      })
    );
  } catch (error) {
    console.error("Error updating booking status:", error);
  }
};

// Jadwalkan tugas untuk dijalankan setiap menit
const job = () =>
  scheduleJob("* * * * *", () => {
    console.log("Running cron job to update booking status...");
    pushNotificationMember().catch((error) =>
      console.error("Error executing pushNotification:", error)
    );
    updateBookingStatus().catch((error) =>
      console.error("Error executing updateBookingStatus:", error)
    );
  });

export default job;
