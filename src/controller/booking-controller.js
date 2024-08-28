import bookingService from "../service/booking-service.js";

const getAllBooking = async (req, res, next) => {
  try {
    const result = await bookingService.getAllBooking(req.user.user_id);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getBookingByProductAndDate = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const request = {
      user_id,
      product_id: parseInt(req.query.product_id, 10),
      booking_date: req.query.booking_date,
    };
    const result = await bookingService.getBookingByProductAndDate(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getUserBooking = async (req, res, next) => {
  try {
    const result = await bookingService.getUserBooking(req.user.user_id);
    res.status(200).json({
      data: result,
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
    await bookingService.createBooking(request);
    res.status(200).json({
      data: "Berhasil ditambahkan",
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const request = req.body;
    request.user_id = user_id;
    const result = await bookingService.update(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const deleteBooking = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const request = req.body;
    request.user_id = user_id;
    await bookingService.deleteBooking(request);
    res.status(200).json({
      data: "Berhasil dihapus",
    });
  } catch (e) {
    next(e);
  }
};

export default {
  getAllBooking,
  getBookingByProductAndDate,
  getUserBooking,
  create,
  update,
  deleteBooking,
};
