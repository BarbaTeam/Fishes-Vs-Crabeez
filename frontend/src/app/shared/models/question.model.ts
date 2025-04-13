export const QuestionNotion = {
    ADDITION: "ADDITION",
    SUBSTRACTION: "SUBSTRACTION",
    MULTIPLICATION: "MULTIPLICATION",
    DIVISION: "DIVISION",
    EQUATION: "EQUATION",
    REWRITING: "REWRITING",
    ENCRYPTION: "ENCRYPTION",
} as const;
export type QuestionNotion = typeof QuestionNotion[keyof typeof QuestionNotion];


export type Question = {
    prompt: string,
    answer: string,
    notion: QuestionNotion,
}


export type AnsweredQuestion = {
    prompt: string,
    expected_answer: string,
    proposed_answer: string,
    notion: QuestionNotion,
};
