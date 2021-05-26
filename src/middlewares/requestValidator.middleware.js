const { tradeAdd, tradeUpdate } = require('../utils/validator.util');
const ResponseCreator = require('../utils/responseCreator.util');
// `schema` gets passed thanks to js closures

const requestValidator = schema => async(req, res, next) => {
    const validation = schema.validate(req.body);
    if (validation.error)
        return ResponseCreator.generateResponse(res, 422, validation.error);
    next();
}

module.exports = {
    requestValidator,
    validator: {
        tradeUpdate,
        tradeAdd,
    }
};