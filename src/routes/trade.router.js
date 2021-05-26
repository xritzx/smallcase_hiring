const { Router } = require('express');
const tradeController = require('../controllers/trade.controller');
const { requestValidator, validator } = require('../middlewares/requestValidator.middleware');

const router = Router();


router.route("/")
    .get(tradeController.getTrades)
    .post(requestValidator(validator.tradeAdd), tradeController.addTrade);
router.post('/update', requestValidator(validator.tradeUpdate), tradeController.updateTrade);
router.post('/delete', tradeController.deleteTrade);
router.get('/returns', tradeController.getReturns);
router.get('/portfolio', tradeController.getPortfolio);

module.exports = router;