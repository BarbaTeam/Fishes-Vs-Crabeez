/**
 * @namespace types
 */

const { Grade } = require('./enums/grade.enum');
const { MistakeCategory } = require('./enums/mistake-category.enum');
const { QuestionNotion } = require('./enums/question-notion.enum');
const { GameState } = require('./enums/game-state.enum');



////////////////////////////////////////////////////////////////////////////////
// Types :
////////////////////////////////////////////////////////////////////////////////


/**
 * @typedef {`u${number}`} UserID
 * A user ID in the format 'u' followed by digits (e.g., 'u123').
 *
 * @memberof types
 */

/**
 * @typedef {`g${number}`} GameID
 * A game ID in the format 'g' followed by digits (e.g., 'g123').
 *
 * @memberof types
 */


/**
 * @typedef {Object} Question
 * @property {string} prompt
 * @property {string} answer
 * @property {QuestionNotion} notion - One of QuestionNotion
 *
 * @memberof types
 */


/**
 * @typedef {Object} AnsweredQuestion
 * @property {string} prompt
 * @property {string} expected_answer
 * @property {string} proposed_answer
 * @property {QuestionNotion} notion - One of QuestionNotion
 *
 * @memberof types
 */


/**
 * @typedef {Object} GameInfo
 * @property {GameID} gameId - Unique identifier for the game.
 * @property {UserID[]} playersId - List of player identifiers.
 * @property {Date} date - Date when the game took place.
 * @property {number} duration - Duration of the game in seconds.
 * @property {GameConfig} config - Game configuration parameters.
 *
 * @memberof types
 */


/**
 * @typedef {Object} GameLog
 * @property {GameID} gameId - Unique identifier for the game.
 * @property {Omit<GameInfo, "gameId">} info - Metadata about the game, without redundant gameId.
 * @property {AnsweredQuestion[][]} playersAnswers - Lists of answers given by players.
 *
 * @memberof types
 */

/**
 * @typedef {Object} Grading
 * @property {Grade} grade - One of Grade
 * @property {number} accuracy - Percentage value
 *
 * @memberof types
 */


/**
 * @typedef {Object} Results
 * @property {number} wordsPerMinute
 * @property {Grading} globalGrading
 * @property {{[notion: QuestionNotion]: Grading}} gradingPerNotion
 * @property {{[category: MistakeCategory]: AnsweredQuestion[]}} mistakes
 *
 * @memberof types
 */


/**
 * @typedef {Object} PlayerResults
 * @property {UserID} playerId
 * @property {GameID} gameId
 * @property {Results} results
 * @property {boolean} answersShown
 *
 * @memberof types
 */


/**
 * @typedef {Object} Statistics
 * @property {number} wordsPerMinute
 * @property {number} wordsPerMinuteImprovement - Signed percentage
 * @property {Grading} globalGrading
 * @property {number} globalAccuracyImprovement - Signed percentage
 * @property {{[notion: string]: Grading}} gradingPerNotion
 * @property {{[notion: string]: number}} accuracyImprovementPerNotion
 * @property {{[category: string]: [MediaStreamTrackEvent, number]}} mostCommonMistakes
 * @property {{[category: string]: [MediaStreamTrackEvent, Date]}} mostRecentMistakes
 *
 * @memberof types
 */

/**
 * @typedef {Object} PlayerStatistics
 * @property {UserID} playerId
 * @property {Statistics} statistics
 *
 * @memberof types
 */


/**
 * @typedef {Object} Leaderboard
 * @property {UserID[]} ranking - Array of user IDs sorted from best to worst
 * @property {Grading[]} gradingPerPlayer - Corresponding grading for each user
 *
 * @memberof types
 */


/**
 * @typedef {Leaderboard} GlobalLeaderboard
 *
 * @memberof types
 */


/**
 * @typedef {Leaderboard & { gameId: GameID }} GameLeaderboard
 * @property {GameID} gameId - Identifier of the game for this leaderboard
 *
 * @memberof types
 */


/**
 * @typedef {Record<QuestionNotion, boolean>} UserQuestionNotionsMask
 *
 * @memberof types
 */

/**
 * @typedef {Object} PlayerConfig
 * @property {UserQuestionNotionsMask} notionsMask
 *
 * @memberof types
 */


/**
 * @typedef {Object} UserConfig
 * @property {boolean} advancedStats
 * @property {boolean} leaderBoard
 *
 * @property {boolean} showsAnswer
 * @property {boolean} readingAssistance
 *
 * @property {number} fontSize
 * @property {number} sound
 *
 * @property {UserQuestionNotionsMask} notionsMask
 *
 * @memberof types
 */


/**
 * @typedef {Object} User
 * @property {UserID} userId
 * @property {string} firstName
 * @property {string} lastName
 * @property {number} age
 * @property {string} icon
 * @property {UserConfig} config
 *
 * @memberof types
 */


/**
 * @typedef {Object} GameLobby
 * @property {GameID} gameId            - The id of the game.
 * @property {string} name              - The name of the game.
 * @property {GameState} state          - The state of the game (waiting or running).
 * @property {UserID[]} playersId       - The list of all connected players' IDs.
 *
 * @memberof types
 */

/**
 * @typedef {Object} GameConfig
 * @property {GameID} gameId                       - The id of the game.
 * @property {number|"inf"} maxDuration            - The maximum duration of a game (in minutes) or "inf".
 * @property {1|2|3} minNbPlayers                  - The minimum number of players needed to start.
 * @property {1|2|3} maxNbPlayers                  - The maximum number of players allowed.
 * @property {number} monstersSpeedCoeff           - Coefficient for monster speed.
 * @property {number} monstersSpawnRate            - The rate at which monsters spawn (1 = normal).
 * @property {boolean} encrypted                   - Whether encryption is enabled.
 *
 * @memberof types
 */

/**
 * @typedef {Object} Game
 * @property {GameID} gameId            - The id of the game.
 * @property {string} name              - The name of the game.
 * @property {GameState} state          - The state of the game.
 * @property {UserID[]} playersId       - The list of connected player IDs.
 * @property {Object} gameConfig
 * @property {number|"inf"} gameConfig.maxDuration
 * @property {1|2|3} gameConfig.minNbPlayers
 * @property {1|2|3} gameConfig.maxNbPlayers
 * @property {number} gameConfig.monstersSpeedCoeff
 * @property {number} gameConfig.monstersSpawnRate
 * @property {boolean} gameConfig.encrypted
 * @property {Record<UserID, PlayerConfig>} playersConfig - Mapping from user ID to their configuration.
 * @property {string} [masterId] 
 *
 * @memberof types
 */



module.exports = {
    Grade,
    GameState,
    MistakeCategory,
    QuestionNotion,
};