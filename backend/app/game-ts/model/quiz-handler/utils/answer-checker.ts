import { AnsweredQuestion } from '../../../../shared/types';



export class AnswerChecker {
    public static checkAnswer(ans: AnsweredQuestion): boolean {
        return ans.proposed_answer === ans.expected_answer;
    }
}
