import express from "express";
import userController from "../controller/user-controller.js";
import productController from "../controller/product-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import helpController from "../controller/help-controller.js";
import bookingController from "../controller/booking-controller.js";
import transactionController from "../controller/transaction-controller.js";
import {
  multerMiddleware,
  multerMiddlewareUpdate,
} from "../middleware/multer-middleware.js";
import notificationController from "../controller/notification-controller.js";
import cors from "cors"; // Import CORS middleware
import membershipController from "../controller/membership-controller.js";
import informationController from "../controller/information-controller.js";

const userRouter = new express.Router();

// Konfigurasi CORS
const corsOptions = {
  origin: "http://localhost:5173", // Ganti dengan URL front-end Anda atau "*" untuk mengizinkan semua origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Metode yang diizinkan
  allowedHeaders: "Content-Type, Authorization", // Header yang diizinkan
};

// Gunakan CORS middleware untuk semua rute di userRouter
userRouter.use(cors(corsOptions));

// Gunakan autentikasi middleware di semua rute setelah CORS middleware
userRouter.use(authMiddleware);

// user
userRouter.get("/api/users/id", userController.getUserId);
userRouter.get("/api/users/current", userController.get);
userRouter.patch("/api/users/current", userController.update);
userRouter.delete("/api/users/logout", userController.logout);

// admin
userRouter.get("/api/users/admin", userController.validateAdmin);
userRouter.get("/api/users", userController.getUsers);
userRouter.get("/api/users/data", userController.getDataUser);
userRouter.post("/api/users/create", userController.create);
userRouter.patch("/api/users/update", userController.updateUsers);
userRouter.delete("/api/users/delete", userController.deleteUsers);

// productService
userRouter.get("/api/users/products", productController.get);
userRouter.get("/api/users/products/field", productController.getField);
userRouter.get(
  "/api/users/products/membership",
  productController.getMembership
);
userRouter.post(
  "/api/users/products",
  multerMiddleware,
  productController.create
);
userRouter.patch(
  "/api/users/products",
  multerMiddlewareUpdate,
  productController.update
);
userRouter.delete("/api/users/products", productController.deleteProduct);

// MembershipService
userRouter.get("/api/users/membership", membershipController.get);

// helpService
userRouter.get("/api/users/help", helpController.get);
userRouter.post("/api/users/help", helpController.create);
userRouter.patch("/api/users/help", helpController.update);
userRouter.delete("/api/users/help", helpController.deleteHelp);

// BookingService
userRouter.get("/api/users/booking", bookingController.getAllBooking);
userRouter.get(
  "/api/users/bookings",
  bookingController.getBookingByProductAndDate
);
userRouter.get("/api/users/current/booking", bookingController.getUserBooking);
userRouter.post("/api/users/booking", bookingController.create);
userRouter.patch("/api/users/booking", bookingController.update);
userRouter.delete("/api/users/booking", bookingController.deleteBooking);

// TransactionService
userRouter.get("/api/users/transaction", transactionController.getAll);
userRouter.get(
  "/api/users/current/transaction",
  transactionController.getUserHistory
);
userRouter.post("/api/users/transaction", transactionController.create);
userRouter.post(
  "/api/users/transaction-cash",
  transactionController.createWithCash
);
// NotificationService
userRouter.post("/api/users/notification", notificationController.create);
userRouter.post(
  "/api/users/notification/category",
  notificationController.createCategoryNotif
);
userRouter.get(
  "/api/users/notifications",
  notificationController.getAllNotifications
);
userRouter.get("/api/users/notification", notificationController.get);
userRouter.post(
  "/api/users/notificationRead",
  notificationController.notifIsRead
);

// InformationAdminService
userRouter.get(
  "/api/users/information/card",
  informationController.getCardInformation
);
userRouter.get(
  "/api/users/information/chard",
  informationController.getChartInformation
);
userRouter.get(
  "/api/users/information/most-spent",
  informationController.getCustomerMostSpent
);
userRouter.get(
  "/api/users/information/field",
  informationController.getFieldMostBuyed
);
export { userRouter };
