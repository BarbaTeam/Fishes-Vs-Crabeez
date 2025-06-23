const { AnsweredQuestion } = require('../../shared/types');



class AnswerChecker {
    /**
     * @param {AnsweredQuestion} ans
     * @returns {boolean}
     */
    static checkAnswer(ans) {
        return ans.proposed_answer === ans.expected_answer;
    }
}



module.exports = { AnswerChecker };