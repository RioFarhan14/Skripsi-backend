import { request } from "express";
import userService from "../service/user-service.js";

const create = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const request = req.body;
    request.user_id = user_id;
    const result = await userService.create(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const register = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
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
    const result = await userService.get(user_id);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const result = await userService.getUsers(user_id);
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
    const result = await userService.update(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const updateUsers = async (req, res, next) => {
  try {
    const user_id_token = req.user.user_id;
    const request = req.body;
    request.user_id_token = user_id_token;
    const result = await userService.updateUsers(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    await userService.logout(req.user.username);
    res.status(200).json({
      data: "OK",
    });
  } catch (e) {
    next(e);
  }
};

const deleteUsers = async (req, res, next) => {
  try {
    const user_id_token = req.user.user_id;
    const request = req.query;
    request.user_id_token = user_id_token;
    await userService.deleteUsers(request);
    res.status(200).json({
      data: "Behasil Dihapus",
    });
  } catch (e) {
    next(e);
  }
};

const getUserId = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const request = {
      user_id_token: user_id,
      username: req.query.username,
    }
    const result = await userService.getUserId(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getDataUser = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const request = req.query;
    request.user_id_token = user_id;
    const result = await userService.getDataUser(request);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const validateAdmin = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    await userService.validateAdmin(user_id);
    res.status(200).json({
      data: "OK",
    });
  } catch (e) {
    next(e);
  }
};

export default {
  register,
  login,
  get,
  getUserId,
  getUsers,
  update,
  logout,
  create,
  updateUsers,
  deleteUsers,
  getDataUser,
  validateAdmin
};
