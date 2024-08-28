import multer from "multer";
import path from "path"; // Mengimpor modul path
import { ResponseError } from "../error/response-error.js";
import { formattedDate, getCurrentTime } from "../utils/timeUtils.js";

const uploadDir = path.join("upload/products");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const uniqueFilename = `${formattedDate(
      getCurrentTime(),
      "YYYYMMDDHHmmss"
    )}${extension}`;
    cb(null, uniqueFilename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const mimeType = allowedTypes.test(file.mimetype);

  if (mimeType) {
    return cb(null, true);
  } else {
    cb(
      new ResponseError(
        400,
        "Hanya file gambar yang diperbolehkan (jpeg, jpg, png)"
      )
    );
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Batas ukuran file 2 MB
  fileFilter: fileFilter,
}).single("image");

const checkRole = (role) => {
  if (role !== "admin") {
    throw new ResponseError(403, "user tidak memiliki izin akses");
  }
  return;
};
// Middleware untuk menangani upload file dan mengembalikan path
const multerMiddleware = (req, res, next) => {
  checkRole(req.user.role);
  upload(req, res, (err) => {
    // Cek apakah file di-upload
    if (err) {
      return next(new ResponseError(400, err.message));
    }
    if (!req.file) {
      return next(new ResponseError(400, "Gambar tidak boleh kosong!"));
    }
    // Mengembalikan path file yang di-upload
    req.filePath = path.join(req.file.filename); // Path lengkap ke file yang di-upload
    next(); // Tidak ada kesalahan, lanjutkan ke middleware berikutnya
  });
};

const multerMiddlewareUpdate = (req, res, next) => {
  checkRole(req.user.role);
  upload(req, res, (err) => {
    //cek apakah file di-upload
    if (err) {
      return next(new ResponseError(400, err.message));
    }
    if (!req.file) {
      return next();
    }
    req.filePath = path.join(req.file.filename); //path lengkap ke file yang di-upload
    next();
  })
};
export { multerMiddleware, multerMiddlewareUpdate }; // Menggunakan ekspor default
