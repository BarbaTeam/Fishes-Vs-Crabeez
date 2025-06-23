const { booleanSchema, numberSchema, stringSchema, DateSchema } = require('./basic-schemas');
const { arraySchema, enumSchema, objectSchema, regexSchema, recordSchema, tupleSchema, unionSchema } = require('./schemas-factories');

const { Grade } = require('../../types/enums/grade.enum');
const { MistakeCategory } = require('../../types/enums/mistake-category.enum');
const { QuestionNotion } = require('../../types/enums/question-notion.enum');



////////////////////////////////////////////////////////////////////////////////
// Schemas :
////////////////////////////////////////////////////////////////////////////////

const UserIDSchema = regexSchema(/^u[0-9]+$/);
const GameIDSchema = regexSchema(/^g[0-9]+$/);

const QuestionNotionSchema = enumSchema(QuestionNotion);
const GradeSchema = enumSchema(Grade);
const MistakeCategorySchema = enumSchema(MistakeCategory)


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

    notionsMask: objectSchema({
        ADDITION: booleanSchema.required(),
        SUBSTRACTION: booleanSchema.required(),
        MULTIPLICATION: booleanSchema.required(),
        DIVISION: booleanSchema.required(),
        EQUATION: booleanSchema.required(),
        REWRITING: booleanSchema.required(),
        ENCRYPTION: booleanSchema.required(),
    }).required()
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
    MistakeCategorySchema,
};