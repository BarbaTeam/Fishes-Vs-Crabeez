const { booleanSchema, numberSchema, stringSchema, DateSchema } = require('./basic-schemas');
const { arraySchema, enumSchema, objectSchema, regexSchema, recordSchema, tupleSchema, unionSchema } = require('./schemas-factories');



const UserIDSchema = regexSchema(/^u[0-9]+$/);
const GameIDSchema = regexSchema(/^g[0-9]+$/);

const QuestionNotionSchema = enumSchema({
    ADDITION: "ADDITION",
    SUBSTRACTION: "SUBSTRACTION",
    MULTIPLICATION: "MULTIPLICATION",
    DIVISION: "DIVISION",
    EQUATION: "EQUATION",
    REWRITING: "REWRITING",
    ENCRYPTION: "ENCRYPTION",
});

const GradeSchema = enumSchema({
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
} /*{
    A_PLUS : "A+",  // 90%
    A      : "A" ,  // 80%
    A_MINUS: "A-",  // 70%
    B_PLUS : "B+",  // 60%
    B      : "B" ,  // 50%
    C_PLUS : "C+",  // 40%
    C      : "C" ,  // 30%
    D_PLUS : "D+",  // 15%
    D      : "D" ,  //  0%
    XF     : "XF",  // Not graded
}*/);

const GradingSchema = objectSchema({
    grade: GradeSchema.required(),
    accuracy: numberSchema.required(),
});

const UserConfigSchema = objectSchema({
    showsAnswer: booleanSchema.required(),
    readingAssistance: booleanSchema.required(),
    advancedStats: booleanSchema.required(),
    leaderBoard: booleanSchema.required(),

    fontSize: numberSchema.required(),
    sound: numberSchema.required(),

    numberRewrite: booleanSchema.required(),
    addition: booleanSchema.required(),
    soustraction: booleanSchema.required(),
    multiplication: booleanSchema.required(),
    division: booleanSchema.required(),
    encryption: booleanSchema.required(),
    equation: booleanSchema.required(),
});

const GameConfigSchema = objectSchema({
    maxDuration: unionSchema(numberSchema, stringSchema.valid('inf')).required(),
    minNbPlayers: numberSchema.valid(1, 2, 3).required(),
    maxNbPlayers: numberSchema.valid(1, 2, 3).required(),
    monstersSpawnRate: numberSchema.required(),
    encrypted: booleanSchema.required(),
});

const AnsweredQuestionSchema = objectSchema({
    prompt: stringSchema.required(),
    expected_answer: stringSchema.required(),
    proposed_answer: stringSchema.required(),
    notion: QuestionNotionSchema.required(),
})

const ResultsSchema = objectSchema({
    wordsPerMinute: numberSchema.required(),
    globalGrading: GradingSchema.required(),
    gradingPerNotion: recordSchema(QuestionNotionSchema, GradingSchema).required(),
    mistakes: objectSchema({
        spelling: arraySchema(AnsweredQuestionSchema).required(),
        calculation: arraySchema(AnsweredQuestionSchema).required(),
    }).required(),
});

const StatisticsSchema = objectSchema({
    wordsPerMinute: numberSchema.required(),
    wordsPerMinuteImprovement: numberSchema.required(), // in signed percentage

    globalGrading: GradingSchema.required(),
    globalAccuracyImprovement: numberSchema.required(), // in signed percentage

    gradingPerNotion: recordSchema(QuestionNotionSchema, GradingSchema).required(),
    accuracyImprovementPerNotion: recordSchema(QuestionNotionSchema, numberSchema).required(),

    mostCommonMistakes: {
        spelling: arraySchema(tupleSchema(AnsweredQuestionSchema, numberSchema)).required(),   // mistake-occurence pairs
        calculation: arraySchema(tupleSchema(AnsweredQuestionSchema, numberSchema)).required(),
    },
    mostRecentMistakes: {
        spelling: arraySchema(tupleSchema(AnsweredQuestionSchema, DateSchema)).required(),     // mistake-date pairs
        calculation: arraySchema(tupleSchema(AnsweredQuestionSchema, DateSchema)).required(),
    },
});


module.exports = {
    AnsweredQuestionSchema,
    UserIDSchema,
    GameIDSchema,
    QuestionNotionSchema,
    GradeSchema,
    GradingSchema,
    UserConfigSchema,
    GameConfigSchema,
    ResultsSchema,
    StatisticsSchema,
};