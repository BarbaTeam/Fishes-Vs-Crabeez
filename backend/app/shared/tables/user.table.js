const { User } = require('../types');
const { UserSchema } = require('../schemas/user.schema');

const { DatabaseTable } = require('./utils/db-table');
const { genUserKey } = require('./utils/key-generators')



/**
 * @type {DatabaseTable<User>}
 */
exports.UserTable = new DatabaseTable(
    "User",
    UserSchema,
    ["userId"],
    genUserKey,
    () => ({
        firstName: "",
        lastName:"",
        age: 0,
        icon: "",
        config: {
            showsAnswer: false,
            readingAssistance: false,

            advancedStats: false,
            leaderBoard: false,

            fontSize: 0,
            sound: 0,

            notionsMask: {
                ADDITION      : false,
                SUBSTRACTION  : false,
                MULTIPLICATION: false,
                DIVISION      : false,
                EQUATION      : false,
                REWRITING     : false,
                ENCRYPTION    : false,
            },
        },
    })
);
