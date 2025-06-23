"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerChecker = void 0;
class AnswerChecker {
    static checkAnswer(ans) {
        return ans.proposed_answer === ans.expected_answer;
    }
}
exports.AnswerChecker = AnswerChecker;
