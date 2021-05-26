const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// ROUTES
const tradeRouter = require('./routes/trade.router');

require('dotenv').config();
const app = express();

const uri = String(process.env.CONNECTION_URI);
mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then()
    .catch((err) => console.log(`Error: ${err.toString()}`));

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database Connected Successful.');
});

// Middlewares to parse request.body as JSON
app.use(
    express.json({
        verify: (req, res, buf) => {
            // In case I need the raw body
            req.rawBody = buf;
        },
    })
);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

// Routes
app.get('/', (req, res) => {
    return res.download("apis.http");
});
app.use('/trade', tradeRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Smallcase Hiring Server running on port ${PORT}`);
});