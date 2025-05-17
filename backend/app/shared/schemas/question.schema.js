const { QuestionNotionSchema } = require('./utils/app-schemas');
const { stringSchema } = require('./utils/basic-schemas');
const { objectSchema } = require('./utils/schemas-factories');



exports.QuestionSchema = objectSchema({
    prompt: stringSchema.required(),
    answer: stringSchema.required(),
    notion: QuestionNotionSchema.required(),
}).required();
