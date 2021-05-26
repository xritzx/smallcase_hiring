const Trade = require("../models/trade.model");


// Ensures a particular Ticker has non negetive quantity
const ensureNonNegetiveShares = async(ticker, shares) => {
    try {
        if (shares > 0)
            return true;
        const tradeCount = await Trade.countDocuments({ ticker: ticker });
        if (tradeCount === 0 && shares < 0)
            return false;
        const possible = await Trade.aggregate([
            { $match: { ticker: ticker } },
            {
                $group: {
                    _id: "ticker",
                    shares: {
                        $sum: "$shares_added"
                    }
                }
            }
        ]);
        if ((possible[0].shares + shares) < 0)
            return false;
        else
            return true;
    } catch (error) {
        throw error;
    }
}

const getTrades = async() => {
    try {
        const tickers = await Trade.aggregate([{
            $group: {
                _id: { security: '$ticker' },
                trades: {
                    $push: "$$ROOT"
                }
            }
        }]);
        return tickers;
    } catch (error) {
        throw error;
    }
}

const addTrade = async body => {
    let { ticker, type, price, shares_added } = body;
    if (type.toLowerCase() === 'sell' && !(await ensureNonNegetiveShares(ticker, -1 * shares_added)))
        throw new Error('Cannot add a sell type: leads to negetive shares');
    // Shares are taken away in a sell so we invert them
    if (type.toLowerCase() === 'sell')
        shares_added *= -1;

    try {
        const trade = new Trade({ ticker, type, price, shares_added });
        return await trade.save();
    } catch (error) {
        throw error;
    }
}

const updateTrade = async body => {
    const { _id, ticker, type, price, shares_added } = body;
    try {
        const trade = await Trade.findById(_id);
        if (type && type === 'sell' && type != trade.type) {
            let checkShares = shares_added || trade.shares_added;
            // When ticker doesn't change we need to check for on ticker
            if (!ticker || ticker === trade.ticker)
            // buy changes to sell the shares decrease by two folds
                if (!(await ensureNonNegetiveShares(trade.ticker, -2 * checkShares)))
                    throw new Error("Can't Change type to Sell, will lead to negetive Shares");
            if (ticker && ticker != trade.ticker) {
                if (!(await ensureNonNegetiveShares(trade.ticker, -1 * checkShares)) ||
                    !(await ensureNonNegetiveShares(ticker, -1 * checkShares)))
                    throw new Error(`Can't change ticker and type: 
                                    Leads to negetive shares either 
                                    in the current ticker or
                                    in the changed Ticker`);
            }
        }
        if (!trade)
            throw new Error(`No trade with id ${_id}`);
        const lastType = trade.type;
        trade.ticker = ticker || trade.ticker;
        trade.type = type || trade.type;
        trade.price = price || trade.price;
        trade.shares_added = shares_added || trade.shares_added;
        // In case if the 'type' of trade was changed we invert the quantity
        if (type && type != lastType)
            trade.shares_added *= -1;
        return await trade.save();
    } catch (error) {
        throw error;
    }
}

const deleteTrade = async body => {
    const { _id } = body;
    try {
        const trade = await Trade.findById(_id);
        // Can't delete a buy share is only sell share is present
        if (trade.type === 'buy')
            if (!ensureNonNegetiveShares(trade.ticker, -trade.shares_added))
                throw new Error("Deleting will lead to a negetive share")
        const deletedTrade = await Trade.findOneAndDelete({ _id });
        return deletedTrade;
    } catch (error) {
        throw error;
    }
}

const getPortfolio = async() => {
    try {
        const portfolio = await Trade.aggregate([{
                $set: {
                    // For weighted sum adding a total transaction amount
                    total: {
                        $cond: [{
                                $eq: ["$type", 'buy']
                            },
                            {
                                $multiply: ["$shares_added", "$price"]
                            },
                            0
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: '$ticker',
                    // Current Share Holdings
                    shares_holding: {
                        $sum: "$shares_added"
                    },
                    shares: {
                        // To get the total shares Bought
                        $sum: {
                            $cond: [{ $lt: [0, "$shares_added"] }, "$shares_added", 0]
                        }
                    },
                    // Summing up the weighted sum
                    total_price: {
                        $sum: {
                            $cond: [{ $lt: [0, "$shares_added"] }, "$total", 0]
                        }
                    },
                }
            },
            {
                $set: {
                    // Getting the averageBuyPrice from pipeline
                    averageBuyPrice: {
                        $divide: ["$total_price", "$shares"]
                    }
                }
            },
            // Hiding the helper fields
            {
                $project: { shares: 0, total_price: 0 }
            }

        ]);
        return portfolio;
    } catch (error) {
        throw error;
    }
}

const getReturns = async() => {
    const portfolio = await getPortfolio();
    let returns = 0;
    portfolio.forEach(stock => {
        returns += (100 - stock.averageBuyPrice) * stock.shares_holding
    });
    return returns;
}

module.exports = {
    addTrade,
    getTrades,
    updateTrade,
    deleteTrade,
    getPortfolio,
    getReturns
}