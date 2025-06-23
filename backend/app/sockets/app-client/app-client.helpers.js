const { UserID, GameID, GameLobby } = require("../../shared/types");


// TODO : Introducing a `UsersManager` to ease the manipulation of games

/** @type {UserID[]} */
const CONNECTED_USERS_ID = [];
/** @type {Map<UserID, boolean>} */
const userLocks = new Map();


// TODO : Introducing a `GamesManager` to ease the manipulation of games

/** @type {Map<GameID, GameLobby>} */
const GAMES = new Map();
/** @type {Map<GameID, boolean>} */
const gameLocks = new Map();


const GUEST_ROOM = "GUEST_ROOM";
const CHILD_ROOM = "CHILD_ROOM";
const ERGO_ROOM = "ERGO_ROOM";


// TODO : Removing it once we are (finally) using multithreading
const GAMES_RUNTIME = {};



module.exports = {
    CONNECTED_USERS_ID,
    userLocks,

    GAMES,
    gameLocks,

    GUEST_ROOM,
    CHILD_ROOM,
    ERGO_ROOM,

    GAMES_RUNTIME,
};
