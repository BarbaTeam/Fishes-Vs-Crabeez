const { UserIDSchema, GradingSchema } = require('./utils/app-schemas');
const { arraySchema, objectSchema } = require('./utils/schemas-factories');



exports.GlobalLeaderboardSchema = objectSchema({
    ranking: arraySchema(UserIDSchema).required(),
    gradingPerPlayer: arraySchema(GradingSchema).required(),
}).required();