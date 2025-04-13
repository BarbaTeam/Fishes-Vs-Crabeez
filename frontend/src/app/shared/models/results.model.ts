import { AnsweredQuestion, QuestionNotion } from "./question.model";


export const Grade = {
    A_PLUS : "A+",  // 97..100%
    A      : "A" ,  // 93..96%
    A_MINUS: "A-",  // 90..92%
    B_PLUS : "B+",  // 87..89%
    B      : "B" ,  // 83..86%
    B_MINUS: "B-",  // 80..82%
    C_PLUS : "C+",  // 77..79%
    C      : "C" ,  // 73..76%
    C_MINUS: "C-",  // 70..72%
    D_PLUS : "D+",  // 67..69%
    D      : "D" ,  // 63..66%
    D_MINUS: "D-",  // 60..62%
    F      : "F" ,  //  0..59%
    XF     : "XF",  // Not graded
} as const;
export type Grade = typeof Grade[keyof typeof Grade];


export type Grading = {
    grade: Grade,
    accuracy: number, // in percentage
};



////////////////////////////////////////////////////////////////////////////////
// Results :
////////////////////////////////////////////////////////////////////////////////

/**
 * BACKEND :: Type representing not yet processed results of a game.
 */
export type RawResults = AnsweredQuestion[];


export type Results = {
    globalGrading: Grading
    gradingPerNotion: { [key in QuestionNotion]: Grading },
    mistakes: {
        spelling: AnsweredQuestion[],
        calculation: AnsweredQuestion[],
    },
};



////////////////////////////////////////////////////////////////////////////////
// Statistics :
////////////////////////////////////////////////////////////////////////////////

export type Statistics = {
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
};
