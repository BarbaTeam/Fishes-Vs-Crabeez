const { UserID, GameID, GameLobby } = require("../../shared/types");



// TODO : Introducing a `UsersManager` to ease the manipulation of games

/** @type {UserID[]} */
const CONNECTED_USERS_ID = [];
/** @type {Map<UserID, boolean>} */
const userLocks = new Map();


// TODO : Introducing a `GamesManager` to ease the manipulation of games

/** @type {Record<GameID, GameLobby>} */
const GAMES_LOBBY = {};
/** @type {Record<GameID, GameConfig>} */
const GAMES_CONFIG = {};
/** @type {Map<GameID, boolean>} */
const gameLocks = new Map();


const GUEST_ROOM = "GUEST_ROOM";
const CHILD_ROOM = "CHILD_ROOM";
const ERGO_ROOM = "ERGO_ROOM";



module.exports = {
    CONNECTED_USERS_ID,
    userLocks,

    GAMES_LOBBY,
    GAMES_CONFIG,
    gameLocks,

    GUEST_ROOM,
    CHILD_ROOM,
    ERGO_ROOM,
};
