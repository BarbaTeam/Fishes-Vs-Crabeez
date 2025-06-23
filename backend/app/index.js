const logger = require('./logger');
const buildServer = require('./build-server');

const { RUNNING_GAMES } = require('./game/running-games');

const { populateTables } = require('./shared/mocks');



buildServer((server) => logger.info(
    `Server is listening on port ${server.address().port}`
));

// TODO : Remove once mocks are no more needed
populateTables();


// TODO : Removing it once we are (finally) using multithreading
for (const gameRunning of Object.values(RUNNING_GAMES)) {
    setInterval(() => gameRunning.runOneFrame(), 1000 / 30);
}
