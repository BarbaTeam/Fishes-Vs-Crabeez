////////////////////////////////////////////////////////////////////////////////
// TODO : Adapting (or even removing) it to support multithreaded running game

const { GameID } = require('../shared/types');


const RUNNING_INTERVALS = {};

/**
 * @typedef {import('../game/runtime').GameRuntime} GameRuntime
 */


/**
 * @type {Record<GameID, GameRuntime>}
 */
const RUNNING_GAMES = {};


/**
 * Register a game runtime into a running loop.
 * @param {GameID} gameId
 * @param {GameRuntime} gameRuntime
 */
function registerRunningGame(gameId, gameRuntime) {
    if (RUNNING_GAMES[gameId]) return; // éviter les doublons

    RUNNING_GAMES[gameId] = gameRuntime;

    const intervalId = setInterval(() => {
        gameRuntime.runOneFrame();
    }, 1000 / 30);

    RUNNING_INTERVALS[gameId] = intervalId;
}


/**
 * Remove a given game from a running loop.
 * @param {GameID} gameId
 */
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
