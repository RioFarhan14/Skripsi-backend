import informationService from "../service/information-service.js";


const getCardInformation = async (req, res, next) => {
    try {
    const user_id = req.user.user_id;
    const request = req.query;
    request.user_id = user_id;
      const result = await informationService.getCardInformation(request);
      res.status(200).json({
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };

  const getChartInformation = async (req, res, next) => {
    try {
    const user_id = req.user.user_id;
    const request = req.query;
    request.user_id = user_id;
      const result = await informationService.getChardInformation(request);
      res.status(200).json({
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };

  const getCustomerMostSpent = async (req, res, next) => {
    try {
      const result = await informationService.getCustomerMostSpent(req.user.user_id);
      res.status(200).json({
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };

  const getFieldMostBuyed = async (req, res, next) => {
    try {
      const user_id = req.user.user_id;
      const request = req.query;
      request.user_id = user_id;
      const result = await informationService.getFieldMostBuyed(request);
      res.status(200).json({
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };

  export default { getCardInformation, getChartInformation, getCustomerMostSpent, getFieldMostBuyed};