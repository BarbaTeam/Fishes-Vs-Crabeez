import { AnsweredQuestion, QuestionNotion, UserID, UserQuestionNotionsMask } from '../../../shared/types';



export interface IQuizHandler {
    receiveAnswer(playerId: UserID, ans: AnsweredQuestion): void;
    sendQuestion(playerId: UserID, notionMask?:UserQuestionNotionsMask): void;
}
