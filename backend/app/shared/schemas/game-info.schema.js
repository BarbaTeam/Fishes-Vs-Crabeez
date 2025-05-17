const { UserIDSchema, GameIDSchema, GameConfigSchema } = require('./utils/app-schemas');
const { DateSchema, numberSchema } = require('./utils/basic-schemas')
const { arraySchema, objectSchema } = require('./utils/schemas-factories');



exports.GameInfoSchema = objectSchema({
    gameId: GameIDSchema.required(),
    playerIds: arraySchema(UserIDSchema).required(),
    date: DateSchema.required(),
    duration: numberSchema.required(),
    config: GameConfigSchema.required(),
}).required();
