import { logger } from "../application/logging.js";
import bookingService from "../service/booking-service.js";
import midtransService from "../service/midtrans-Service.js";
import transactionService from "../service/transaction-service.js";
import { validateProduct, validateUser } from "../utils/validate.js";

const getAll = async (req, res, next) => {
  try {
    const result = await transactionService.getAllTransaction(req.user.user_id);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getUserHistory = async (req, res, next) => {
  try {
    const result = await transactionService.getUserHistoryTransaction(
      req.user.user_id
    );
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};
const updateTransactionMidtrans = async (req, res, next) => {
  try {
    const result = await midtransService.updateNotificationStatusOnMidtrans(
      req.body
    );
    logger.info(result.message);
    res.status(200).json({
      status: "success",
      message: "OK",
    });
  } catch (e) {
    next(e);
  }
};

const createWithCash = async (req, res, next) => {
  try {
    const user_id_token = req.user.user_id;
    const request = { ...req.body, user_id_token }; // Clone and extend req.body

    const productType = await validateProduct(request.product_id);

    const validate = await validateUser(user_id_token);

    if (validate.role !== "admin") {
      throw new ResponseError(403, "user tidak memiliki izin");
    }

    let result;
    if (productType.product_type === "field") {
      const bookingStatus = await bookingService.createBooking(request);
      result = await transactionService.create(bookingStatus);
    } else {
      result = await transactionService.create(request);
      await transactionService.membershipPayment(request.user_id,request.product_id);
    }

    await transactionService.updateTransactionCash(result.transaction_id);

    res.status(200).json({
      data: "Transaksi Berhasil",
    });
  } catch (e) {
    next(e);
  }
};


const create = async (req, res, next) => {
  try {
    const user_id_token = req.user.user_id;
    const request = req.body;
    request.user_id_token = user_id_token;

    const productType = await validateProduct(request.product_id);
    
    let result;
    if (productType.product_type === "field") {
      const bookingStatus = await bookingService.createBooking(request);
      result = await transactionService.create(bookingStatus);
    } else {
      result = await transactionService.create(request);
    }

    const transaction = await midtransService.createTransaction(
      result.transaction_id,
      result.total_amount
    );

    const updateTransaction = await midtransService.updateTransactionMidtrans(
      result.transaction_id,
      transaction.token,
      transaction.redirect_url
    );

    if (updateTransaction) {      
      // Memanggil fungsi updateTransactionFail tanpa menggunakan cron job
      setTimeout(async () => {
        try {
          await bookingService.updateTransactionFail(result.transaction_id);
        } catch (error) {
          logger.info("Error updating transaction status to failed:", error);
        }
      }, 10 * 60 * 1000); // Menunggu 10 menit sebelum menjalankan fungsi
    }
    res.status(200).json({
      data: updateTransaction,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  getAll,
  getUserHistory,
  create,
  createWithCash,
  updateTransactionMidtrans,
};
