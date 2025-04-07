export const QuestionNotion = {
  ADDITION: "ADDITION",
  SUBSTRACTION: "SUBSTRACTION",
  MULTIPLICATION: "MULTIPLICATION",
  DIVISION: "DIVISION",
  REWRITING: "REWRITING",
  ENCRYPTION: "ENCRYPTION",
  EQUATION: "EQUATION",
} as const;
export type QuestionNotion = typeof QuestionNotion[keyof typeof QuestionNotion];

export type Question = {
    prompt: string,
    answer: string,
    notion: QuestionNotion,
}
