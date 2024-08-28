import express from "express";
import userController from "../controller/user-controller.js";
import path from "path";
import transactionController from "../controller/transaction-controller.js";
import cors from "cors"; // Import CORS middleware

const publicRouter = express.Router();
const baseDir = process.cwd();

// Konfigurasi CORS
const corsOptions = {
  origin: "http://localhost:5173", // Ganti dengan URL front-end Anda, atau gunakan "*" untuk mengizinkan semua origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Metode yang diizinkan
  allowedHeaders: "Content-Type, Authorization", // Header yang diizinkan
};

// Gunakan CORS middleware untuk semua rute di publicRouter
publicRouter.use(cors(corsOptions));

// Definisikan rute API
publicRouter.post("/api/users", userController.register);
publicRouter.post("/api/users/login", userController.login);
publicRouter.post(
  "/api/transaction/notification",
  transactionController.updateTransactionMidtrans
);

// Rute untuk mengirim file gambar
publicRouter.get("/images/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(baseDir, "upload/products", filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(err.status || 500).send("File not found");
    }
  });
});

export { publicRouter };
