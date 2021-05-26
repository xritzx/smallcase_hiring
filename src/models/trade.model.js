const mongoose = require("mongoose");

/* 
    -- Trade --
    It acts as a ledger to all of our transactions
    And portfolio/average Price can be generated on the fly on demand.
    Instead of recomputing the AverageBuyPrice everytime the user trades
*/
const tradeSchema = new mongoose.Schema({
    ticker: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    shares_added: {
        type: Number,
        required: true
    }
}, { timestamp: true });

const Trade = mongoose.model("Trade", tradeSchema);
module.exports = Trade;