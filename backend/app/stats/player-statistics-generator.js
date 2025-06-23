// Tables :
const { GameInfoTable } = require('../shared/tables/game-info.table');

// Utils :
const {grade, NO_GRADING} = require('./utils/grade');

// Types :
const { PlayerResults, Statistics} = require('../shared/types');
const { QuestionNotion, Grade } = require('../shared/types/enums');



////////////////////////////////////////////////////////////////////////////////
// Utils :
////////////////////////////////////////////////////////////////////////////////

/**
 * Get weight coefficients by history index.
 * @param {number} idx
 * @returns {number}
 */
function getCoeffs(idx) {
    switch (idx) {
        case 0: return 4;
        case 1: return 2;
        case 2: return 2;
        case 3: return 1;
        case 4: return 1;
        default: return 0;
    }
}


/**
 * Compute percent improvement from a to b.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function computeImprovement(a, b) {
    return (b - a) * 100 / a;
}



////////////////////////////////////////////////////////////////////////////////
// Implementation :
////////////////////////////////////////////////////////////////////////////////

/**
 * Compute weighted average WPM and its improvement.
 * @param {PlayerResults[]} playerHistory
 * @returns {{ wordsPerMinute: number, wordsPerMinuteImprovement: number }}
 */
function computeWPMStats(playerHistory) {
    let wordsPerMinute = 0;
    let totalCoeffs = 0;

    for (let i = 0; i < playerHistory.length; i++) {
        const coeff = getCoeffs(i);
        wordsPerMinute += playerHistory[i].results.wordsPerMinute * coeff;
        totalCoeffs += coeff;
    }
    wordsPerMinute /= totalCoeffs;

    return {
        wordsPerMinute,
        wordsPerMinuteImprovement: computeImprovement(
            wordsPerMinute,
            playerHistory[0].results.wordsPerMinute
        )
    };
}

/**
 * Compute global grading and its improvement.
 * @param {PlayerResults[]} playerHistory
 * @returns {{ globalGrading: import('../types/answered-question').Grading, globalAccuracyImprovement: number }}
 */
function computeGlobalGradingStats(playerHistory) {
    let globalAcc = 0;
    let totalCoeffs = 0;

    for (let i = 0; i < playerHistory.length; i++) {
        const coeff = getCoeffs(i);
        globalAcc += playerHistory[i].results.globalGrading.accuracy * coeff;
        totalCoeffs += coeff;
    }
    globalAcc /= totalCoeffs;

    return {
        globalGrading: grade(globalAcc),
        globalAccuracyImprovement: computeImprovement(
            globalAcc,
            playerHistory[0].results.globalGrading.accuracy
        )
    };
}

/**
 * Compute grading and improvement per notion.
 * @param {PlayerResults[]} playerHistory
 * @returns {{ gradingPerNotion: Record<string, import('../types/answered-question').Grading>, accuracyImprovementPerNotion: Record<string, number> }}
 */
function computeGradingPerNotionStats(playerHistory) {
    /** @type {Record<string, import('../types/answered-question').Grading>} */
    const gradingPerNotion = {};
    /** @type {Record<string, number>} */
    const accuracyImprovementPerNotion = {};

    const latest = playerHistory[0].results;

    for (const notion of Object.values(QuestionNotion)) {
        const played = playerHistory.filter(
            pr => pr.results.gradingPerNotion[notion].grade !== Grade.XF
        );

        if (played.length === 0) {
            gradingPerNotion[notion] = NO_GRADING;
            accuracyImprovementPerNotion[notion] = 0;
            continue;
        }

        let acc = 0;
        let totalCoeffs = 0;
        for (let i = 0; i < played.length; i++) {
            const coeff = getCoeffs(i);
            acc += played[i].results.gradingPerNotion[notion].accuracy * coeff;
            totalCoeffs += coeff;
        }
        acc /= totalCoeffs;

        gradingPerNotion[notion] = grade(acc);
        accuracyImprovementPerNotion[notion] = computeImprovement(
            acc,
            latest.gradingPerNotion[notion].accuracy
        );
    }

    return {
        gradingPerNotion,
        accuracyImprovementPerNotion
    };
}

/**
 * Compute most common and most recent mistakes.
 * @param {PlayerResults[]} playerHistory
 * @returns {{ mostCommonMistakes: { spelling: [AnsweredQuestion, number][], calculation: [AnsweredQuestion, number][] }, mostRecentMistakes: { spelling: [AnsweredQuestion, string][], calculation: [AnsweredQuestion, string][] } }}
 */
function computeMistakeStats(playerHistory) {
    /** @type {{ spelling: [AnsweredQuestion, number][], calculation: [AnsweredQuestion, number][] }} */
    const mostCommon = { spelling: [], calculation: [] };
    /** @type {{ spelling: [AnsweredQuestion, string][], calculation: [AnsweredQuestion, string][] }} */
    const mostRecent = { spelling: [], calculation: [] };

    for (let i = 0; i < playerHistory.length; i++) {
        const res = playerHistory[i].results;
        const date = GameInfoTable.getByKey({ gameId: playerHistory[i].gameId }).date;

        for (const m of res.mistakes.spelling) {
            mostCommon.spelling.push([m, 1]);
            mostRecent.spelling.push([m, date]);
        }
        for (const m of res.mistakes.calculation) {
            mostCommon.calculation.push([m, 1]);
            mostRecent.calculation.push([m, date]);
        }
    }

    return {
        mostCommonMistakes: mostCommon,
        mostRecentMistakes: mostRecent
    };
}

/**
 * Generate overall player statistics from history.
 * @param {PlayerResults[]} playerHistory
 * @returns {Statistics}
 */
exports.genStatisticsFromHistory = (playerHistory) => {
    if (playerHistory.length === 0) {
        throw new Error("Tried to compute statistics on player with no history");
    }

    return {
        ...computeWPMStats(playerHistory),
        ...computeGlobalGradingStats(playerHistory),
        ...computeGradingPerNotionStats(playerHistory),
        ...computeMistakeStats(playerHistory)
    };
}
