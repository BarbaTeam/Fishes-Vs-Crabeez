const logger = require('./logger');
const buildServer = require('./build-server');

const { populateTables } = require('./shared/mocks');

buildServer((server) => logger.info(
    `Server is listening on port ${server.address().port}`
));

// TODO : Remove once mocks are no more needed
populateTables();
