const tradeService = require('../services/trade.service');
const ResponseCreator = require('../utils/responseCreator.util');

const getTrades = async(req, res) => {
    try {
        const trades = await tradeService.getTrades();
        return ResponseCreator.generateResponse(res, 200, trades, 'Fetched Trade List');
    } catch (err) {
        return ResponseCreator.generateResponse(res, 500, err, `${err.message}`);
    }
};

const addTrade = async(req, res) => {
    try {
        const trade = await tradeService.addTrade(req.body);
        return ResponseCreator.generateResponse(res, 200, trade, 'Trade Created');
    } catch (err) {
        return ResponseCreator.generateResponse(res, 500, err, `${err.message}`);
    }
};

const updateTrade = async(req, res) => {
    try {
        const updatedTrade = await tradeService.updateTrade(req.body);
        return ResponseCreator.generateResponse(res, 200, updatedTrade, 'Trade updated');
    } catch (err) {
        return ResponseCreator.generateResponse(res, 500, err, `${err.message}`);
    }
};

const deleteTrade = async(req, res) => {
    const { _id } = req.body;
    if (!_id)
        return ResponseCreator.generateResponse(res, 422, {}, `_id is required`);
    try {
        const deletedTrade = await tradeService.deleteTrade(req.body);
        return ResponseCreator.generateResponse(res, 200, deletedTrade, 'Trade deleted');
    } catch (err) {
        return ResponseCreator.generateResponse(res, 500, err, `${err.message}`);
    }
};

const getReturns = async(req, res) => {
    try {
        const returns = await tradeService.getReturns();
        return ResponseCreator.generateResponse(res, 200, returns, 'Total portfolio Returns');
    } catch (err) {
        return ResponseCreator.generateResponse(res, 500, err, `${err.message}`);
    }
};

const getPortfolio = async(req, res) => {
    try {
        const portfolio = await tradeService.getPortfolio();
        return ResponseCreator.generateResponse(res, 200, portfolio, 'Current Portfolio');
    } catch (err) {
        return ResponseCreator.generateResponse(res, 500, err, `${err.message}`);
    }
}

module.exports = {
    getTrades,
    addTrade,
    updateTrade,
    deleteTrade,
    getReturns,
    getPortfolio
}