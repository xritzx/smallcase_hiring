const joi = require('joi');

/* Validator Schemas for Selling, Buying, Trading */

/*
    Trade Addition validation for
    ensuring all parameters are
    present and are valid
*/
const tradeAdd = joi.object().keys({
    price: joi.number()
        .min(0)
        .required(),
    shares_added: joi.number()
        .min(1)
        .required(),
    type: joi.string()
        .valid("buy", "sell")
        .insensitive()
        .required(),
    ticker: joi.string()
        .required(),
});

/*
    Trade Updation needs to be validated as well
*/
const tradeUpdate = joi.object().keys({
    _id: joi.string()
        .required(),
    price: joi.number()
        .min(0),
    shares_added: joi.number()
        .min(1),
    type: joi.string()
        .valid("buy", "sell")
        .insensitive(),
    ticker: joi.string(),
});

module.exports = {
    tradeUpdate,
    tradeAdd,
}