const { PlayerResults } = require('../types');
const { PlayerResultsSchema } = require('../schemas/player-results.schema');

const { DatabaseTable } = require('./utils/db-table')
const { genPlayerKey, genGameKey } = require('./utils/key-generators');



/**
 * @type {DatabaseTable<PlayerResults>}
 */
exports.PlayerResultsTable = new DatabaseTable(
    "PlayerResults",
    PlayerResultsSchema,
    ["playerId", "gameId"],
    () => ({...genPlayerKey(), ...genGameKey()}),
    () => ({
        results: {
            wordsPerMinute: 0,
            globalGrading: {grade: "XF", accuracy: 0},
            gradingPerNotion: {
                ADDITION      : {grade: "XF", accuracy: 0},
                SUBSTRACTION  : {grade: "XF", accuracy: 0},
                MULTIPLICATION: {grade: "XF", accuracy: 0},
                DIVISION      : {grade: "XF", accuracy: 0},
                EQUATION      : {grade: "XF", accuracy: 0},
                REWRITING     : {grade: "XF", accuracy: 0},
                ENCRYPTION    : {grade: "XF", accuracy: 0},
            },
            mistakes: {
                spelling: [],
                calculation: [],
            },
        },
        answersShown: false,
    })
);