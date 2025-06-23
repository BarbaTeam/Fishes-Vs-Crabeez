import { Question, Notion } from '../models/question.model';

export const MOCK_QUESTIONS: Question[] = [
    {
        prompt: "",
        answer: "}!':\!",
        notion: Notion.ENCRYPTION,
    }, {
        prompt: "Calculer : 1 * 10 =&nbsp;",
        answer: "dix",
        notion: Notion.MULTIPLICATION,
    }, {
        prompt: "Calculer : 10 + 6 =&nbsp;",
        answer: "seize",
        notion: Notion.ADDITION,
    }, {
        prompt: "Calculer : 8 + 2 =&nbsp;",
        answer: "dix",
        notion: Notion.ADDITION,
    }, {
        prompt: "Calculer : 4 - 2 =&nbsp;",
        answer: "deux",
        notion: Notion.SUBSTRACTION,
    }, {
        prompt: "Calculer : 10 - 9 =&nbsp;",
        answer: "un",
        notion: Notion.SUBSTRACTION,
    }, {
        prompt: "Calculer : 18 / 6 =&nbsp;",
        answer: "trois",
        notion: Notion.DIVISION,
    }, {
        prompt: "Reecrire 40 :&nbsp;",
        answer: "quarante",
        notion: Notion.REWRITING
    }, {
        prompt: "Calculer : 3 - 9 =&nbsp;",
        answer: "moins six",
        notion: Notion.SUBSTRACTION,
    }, {
        prompt: "Calculer 10 - 9 =&nbsp;",
        answer: "un",
        notion: Notion.SUBSTRACTION,
    },
];
