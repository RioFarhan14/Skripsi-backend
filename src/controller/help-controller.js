import helpService from "../service/help-service.js";

const get = async (req, res, next) => {
  try {
    const result = await helpService.get(req.user.user_id);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};
const create = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const request = req.body;
    request.user_id = user_id;
    const result = await helpService.create(request);
    res.status(200).json({
      data: result,
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
    const result = await helpService.update(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const deleteHelp = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const request = req.body;
    request.user_id = user_id;
    await helpService.deleteHelp(request);
    res.status(200).json({
      data: "Data berhasil dihapus",
    });
  } catch (e) {
    next(e);
  }
};
export default {
  get,
  create,
  update,
  deleteHelp,
};
