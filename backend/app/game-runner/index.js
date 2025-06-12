const RUNNING_GAMES = {};
const RUNNING_INTERVALS = {};

function registerRunningGame(gameId, gameRuntime) {
    if (RUNNING_GAMES[gameId]) return; // éviter les doublons

    RUNNING_GAMES[gameId] = gameRuntime;

    const intervalId = setInterval(() => {
        gameRuntime.runOneFrame();
    }, 1000 / 30);

    RUNNING_INTERVALS[gameId] = intervalId;
}

function stopRunningGame(gameId) {
    if (RUNNING_INTERVALS[gameId]) {
        clearInterval(RUNNING_INTERVALS[gameId]);
        delete RUNNING_INTERVALS[gameId];
    }
    delete RUNNING_GAMES[gameId];
}

module.exports = {
    RUNNING_GAMES,
    registerRunningGame,
    stopRunningGame,
};
