const { UserTable } = require('../shared/tables/user.table');

// Types :
const { AnsweredQuestion, Grading, GameLog, PlayerResults, Results } = require('../shared/types');
const { Grade, QuestionNotion } = require('../shared/types/enums');

// Utils :
const { grade } = require("./utils/grade");
const { MistakesSorter } = require("./utils/mistakes-sorter");



////////////////////////////////////////////////////////////////////////////////
// Utils :
////////////////////////////////////////////////////////////////////////////////

/**
 * Default grading when no questions answered
 * @type {Grading}
 */
const NO_GRADING = { grade: Grade.XF, accuracy: 0 };

/**
 * Checks if the proposed answer is correct.
 * @param {AnsweredQuestion} ans
 * @returns {boolean}
 */
function isCorrect(ans) {
    return ans.expected_answer === ans.proposed_answer;
}

/**
 * Groups answered questions by their notion.
 * @param {AnsweredQuestion[]} answers
 * @returns {{[notion: string]: AnsweredQuestion[]}}
 */
function filterAnswersPerNotion(answers) {
    const groups = {};
    // initialize empty arrays for each notion
    Object.values(QuestionNotion).forEach(n => { groups[n] = []; });
    // assign answers
    for (let ans of answers) {
        groups[ans.notion].push(ans);
    }
    return groups;
}

/**
 * Computes words per minute based on total proposed answers and duration.
 * @param {AnsweredQuestion[]} answers
 * @param {number} duration - In minutes
 * @returns {number}
 */
function computeWPM(answers, duration) {
    let totalWords = 0;
    for (let ans of answers) {
        totalWords += ans.proposed_answer.split(' ').filter(Boolean).length;
    }
    return totalWords / duration;
}

/**
 * Generates grading records per notion based on accuracy percentages.
 * @param {{[notion: string]: number}} accuracyPerNotion
 * @returns {{[notion: string]: Grading}}
 */
function gradeEachNotion(accuracyPerNotion) {
    const result = {};
    for (let notion of Object.values(QuestionNotion)) {
        const acc = accuracyPerNotion[notion];
        result[notion] = isNaN(acc) || acc < 0
            ? NO_GRADING
            : grade(acc);
    }
    return result;
}



////////////////////////////////////////////////////////////////////////////////
// Implementation :
////////////////////////////////////////////////////////////////////////////////

/**
 * Processes player answers into performance results.
 * @param {AnsweredQuestion[]} answers
 * @param {number} gameDuration - Duration in minutes
 * @returns {Results}
 */
exports.processPlayerAnswers = (answers, gameDuration) => {
    const answersPerNotion = filterAnswersPerNotion(answers);
    const accuracyPerNotion = {};
    let correctCount = 0;
    const mistakes = [];

    // calculate accuracy per notion
    for (let notion of Object.values(QuestionNotion)) {
        const list = answersPerNotion[notion];
        if (!list.length) {
            accuracyPerNotion[notion] = -1;
            continue;
        }
        let count = 0;
        for (let ans of list) {
            if (isCorrect(ans)) {
                count++;
                correctCount++;
            } else {
                mistakes.push(ans);
            }
        }
        accuracyPerNotion[notion] = (count * 100) / list.length;
    }

    const totalAccuracy = (correctCount * 100) / answers.length;

    return {
        wordsPerMinute   : computeWPM(answers, gameDuration),
        globalGrading    : grade(totalAccuracy),
        gradingPerNotion : gradeEachNotion(accuracyPerNotion),
        mistakes         : MistakesSorter.sort(mistakes)
    };
}
