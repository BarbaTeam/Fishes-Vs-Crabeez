const { UserIDSchema, GameIDSchema, GradingSchema } = require('./utils/app-schemas');
const { arraySchema, objectSchema } = require('./utils/schemas-factories');



exports.GameLeaderboardSchema = objectSchema({
    gameId: GameIDSchema.required(),
    ranking: arraySchema(UserIDSchema).required(),
    gradingPerPlayer: arraySchema(GradingSchema).required(),
}).required();
