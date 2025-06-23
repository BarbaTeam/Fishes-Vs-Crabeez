const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');

const api = require('./api');
const { AppClient } = require('./io/app-client');


module.exports = (cb) => {
    const app = express();
    app.disable('x-powered-by');
    app.use(cors());
    app.use(bodyParser.json());
    app.use(morgan('[:date[iso]] :method :url :status :response-time ms'));

    app.use('/api', api);
    app.use('*', (req, res) => res.status(404).end());

    const server = http.createServer(app);

    server.listen(process.env.PORT || 9428, () => {
        if (cb) cb(server);
        console.log(`[SERVER] Listening on port ${process.env.PORT || 9428}`);
    });

    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        const client = new AppClient(io, socket);
        socket.on("disconnect", () => client.disconnect());
    });
};
