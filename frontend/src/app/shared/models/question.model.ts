export const Notion = {
  ADDITION: "ADDITION",
  SUBSTRACTION: "SUBSTRACTION",
  MULTIPLICATION: "MULTIPLICATION",
  DIVISION: "DIVISION",
  REWRITING: "REWRITING",
  ENCRYPTION: "ENCRYPTION",
  EQUATION: "EQUATION",
} as const;
export type Notion = typeof Notion[keyof typeof Notion];

export type Question = {
    prompt: string,
    answer: string,
    notion: Notion,
}
