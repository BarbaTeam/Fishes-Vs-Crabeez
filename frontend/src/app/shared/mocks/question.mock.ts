import { Question, QuestionNotion } from '../models/question.model';

export const MOCK_QUESTIONS: Question[] = [
    {
        prompt: "1 × 10 =\xa0",
        answer: "dix",
        notion: QuestionNotion.MULTIPLICATION,
    }, {
        prompt: "",
        answer: "}!':\!",
        notion: QuestionNotion.ENCRYPTION,
    }, {
        prompt: "10 + 6 =\xa0",
        answer: "seize",
        notion: QuestionNotion.ADDITION,
    }, {
        prompt: "8 + 2 =\xa0",
        answer: "dix",
        notion: QuestionNotion.ADDITION,
    }, {
        prompt: "4 - 2 =\xa0",
        answer: "deux",
        notion: QuestionNotion.SUBSTRACTION,
    }, {
        prompt: "10 - 9 =\xa0",
        answer: "un",
        notion: QuestionNotion.SUBSTRACTION,
    }, {
        prompt: "18 / 6 =\xa0",
        answer: "trois",
        notion: QuestionNotion.DIVISION,
    }, {
        prompt: "40 :\xa0",
        answer: "quarante",
        notion: QuestionNotion.REWRITING
    }, {
        prompt: "3 - 9 =\xa0",
        answer: "-six",
        notion: QuestionNotion.SUBSTRACTION,
    }, {
        prompt: "10 - 9 =\xa0",
        answer: "un",
        notion: QuestionNotion.SUBSTRACTION,
    },
];
