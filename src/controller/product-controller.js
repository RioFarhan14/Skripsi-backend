import productService from "../service/product-service.js";

const create = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const request = req.body;
    const image = req.filePath;
    request.user_id = user_id;
    request.image_url = image;
    const result = await productService.create(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const request = req.query;
    request.user_id = user_id;
    const result = await productService.get(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getField = async (req, res, next) => {
  try {
    const result = await productService.getField(req.user.user_id);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getMembership = async (req, res, next) => {
  try {
    const result = await productService.getMembership(req.user.user_id);
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
    if(req.filePath){
      const image = req.filePath;
      request.image_url = image; 
    }
    request.user_id = user_id;
    const result = await productService.update(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};
const deleteProduct = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const request = req.query;
    request.user_id = user_id;
    await productService.deleteProduct(request);
    res.status(200).json({
      data: "Berhasil dihapus",
    });
  } catch (e) {
    next(e);
  }
};
export default {
  create,
  get,
  getField,
  getMembership,
  update,
  deleteProduct,
};
