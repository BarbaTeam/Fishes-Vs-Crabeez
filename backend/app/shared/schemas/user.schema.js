const { UserConfigSchema, UserIDSchema } = require('./utils/app-schemas');
const { numberSchema, stringSchema } = require('./utils/basic-schemas');
const { objectSchema } = require('./utils/schemas-factories');



exports.UserSchema = objectSchema({
    userId: UserIDSchema.required(),
    firstName: stringSchema.required(),
    lastName: stringSchema.required(),
    age: numberSchema.required(),
    icon: stringSchema.required(),
    config: UserConfigSchema.required(),
}).required();
