import cors from "cors";
import { web } from "./src/application/web.js";
import { logger } from "./src/application/logging.js";
import { PORT } from "./src/utils/constant.js";
import job from "./src/utils/cron-job.js";

// Konfigurasi CORS
const corsOptions = {
  origin: "http://localhost:5173", // Ganti dengan URL front-end Anda
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Metode yang diizinkan
  allowedHeaders: "Content-Type, Authorization", // Header yang diizinkan
};

// Jika menggunakan Express.js sebagai framework utama
web.use(cors(corsOptions));

job();

// Jalankan server
web.listen(PORT, () => {
  logger.info("aplikasi mulai berjalan");
});
