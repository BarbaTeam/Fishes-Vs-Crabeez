const { StatisticsSchema, UserIDSchema } = require("./utils/app-schemas");
const { objectSchema } = require("./utils/schemas-factories");

exports.PlayerStatisticsSchema = objectSchema({
    playerId: UserIDSchema.required(),
    statistics: StatisticsSchema.required(),
}).required();
