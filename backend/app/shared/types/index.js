/**
 * @namespace types
 */

const { Grade } = require('./enums/grade.enum');
const { MistakeCategory } = require('./enums/mistake-category.enum');
const { QuestionNotion } = require('./enums/question-notion.enum');
const { GameLobbyState } = require('./enums/game-lobby-state.enum');



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
 * @typedef {Object} GameConfig
 * @property {number | "inf"} maxDuration - Maximum game duration in seconds or "inf" for unlimited.
 * @property {1 | 2 | 3} minNbPlayers - Minimum number of players (1 to 3).
 * @property {1 | 2 | 3} maxNbPlayers - Maximum number of players (1 to 3).
 * @property {number} monstersSpeedCoeff - Speed coefficient influencing how fast monsters moves
 * @property {number} monstersSpawnRate - Rate at which monsters appear.
 * @property {boolean} encrypted - Whether the game uses encryption for questions.
 *
 * @memberof types
 */

/**
 * @typedef {Object} GameLobby
 * @property {GameID} gameId
 * @property {string} name
 * @property {UserID[]} playersId
 * @property {GameLobbyState} state
 * @property {Record<UserID, UserQuestionNotionsMask>} playersNotionsMask
 * @property {string|null} [masterId]   // socket.id of the GAME_MASTER, or null if none
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



module.exports = {
    Grade,
    GameLobbyState,
    MistakeCategory,
    QuestionNotion,
};