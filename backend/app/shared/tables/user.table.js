const { DatabaseTable } = require('./utils/db-table');
const { genUserKey } = require('./utils/key-generators')

const { UserSchema } = require('../schemas/user.schema');



exports.UserTable = new DatabaseTable(
    "User",
    UserSchema,
    ["userId"],
    genUserKey,
    () => ({
        name: "",
        age: 0,
        icon: "",
        userConfig: {
            // TODO : Update on default user config form
            showsAnswer: false,
            readingAssistance: false,
            advancedStats: false,
            leaderBoard: false,

            fontSize: 0,
            sound: 0,

            numberRewrite: false,
            addition: false,
            soustraction: false,
            multiplication: false,
            division: false,
            encryption: false,
            equation: false,
        },
    })
);
