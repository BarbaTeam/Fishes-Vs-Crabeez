import { EnemyKind } from "./enemy-kind.model";
import { AnsweredQuestion, QuestionNotion } from "./question.model";


export const Grade = {
    S : "S" ,  // 96..100%
    A : "A" ,  // 90..95%
    B : "B" ,  // 76..89%
    C : "C" ,  // 46..75%
    D : "D" ,  // 30..44%
    E : "E" ,  // 21..29
    F : "F" ,  //  0..20%
    XF: "XF",  // Not graded
} as const;
export type Grade = typeof Grade[keyof typeof Grade];


export type Grading = {
    grade: Grade,
    accuracy: number, // in percentage
};



////////////////////////////////////////////////////////////////////////////////
// Results :
////////////////////////////////////////////////////////////////////////////////

export type Results = {
    wordsPerMinute: number,
    globalGrading: Grading
    gradingPerNotion: { [key in QuestionNotion]: Grading },
    mistakes: {
        spelling: AnsweredQuestion[],
        calculation: AnsweredQuestion[],
    },

    score : number;

    kills: { [key in EnemyKind]: number }
};



////////////////////////////////////////////////////////////////////////////////
// Statistics :
////////////////////////////////////////////////////////////////////////////////

export type Statistics = {
    wordsPerMinute: number,
    wordsPerMinuteImprovement: number, // in signed percentage

    globalGrading: Grading,
    globalAccuracyImprovement: number, // in signed percentage

    gradingPerNotion: { [key in QuestionNotion]: Grading },
    accuracyImprovementPerNotion: { [key in QuestionNotion]: number },

    mostCommonMistakes: {
        spelling: [AnsweredQuestion, number][], // mistake-occurence pairs
        calculation: [AnsweredQuestion, number][],
    },
    mostRecentMistakes: {
        spelling: [AnsweredQuestion, Date][], // mistake-date pairs
        calculation: [AnsweredQuestion, Date][],
    },
    
    globalScore : number,

    globalKills: { [key in EnemyKind]: number },
};
