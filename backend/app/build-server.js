const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const api = require('./api');

module.exports = (cb) => {
    const app = express();
    app.disable('x-powered-by');
    app.use(cors());
    app.use(bodyParser.json({}));
    app.use(morgan('[:date[iso]] :method :url :status :response-time ms - :res[content-length]'));
    app.use('/api', api);
    app.use('*', (req, res) => res.status(404).end());
    const server = app.listen(process.env.PORT || 9428, () => cb && cb(server));
}
