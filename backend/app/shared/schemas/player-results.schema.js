const { UserIDSchema, GameIDSchema, ResultsSchema } = require('./utils/app-schemas');
const { booleanSchema } = require('./utils/basic-schemas');
const { objectSchema } = require('./utils/schemas-factories');



exports.PlayerResultsSchema = objectSchema({
    playerId: UserIDSchema.required(),
    gameId: GameIDSchema.required(),
    results: ResultsSchema.required(),
    answersShown: booleanSchema.required(),
}).required();
