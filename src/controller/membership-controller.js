import membershipService from "../service/membership-service.js";

const get = async (req, res, next) => {
    try {
      const result = await membershipService.get(req.user.user_id);
      res.status(200).json({
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };

  export default { get };