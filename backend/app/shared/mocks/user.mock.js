const { UserTable } = require('../tables/user.table');



const MOCK_USER = [
    {
        userId:"u1",
        firstName: "Eli",
        lastName: "KOPTER",
        age: 9,
        icon: "red_fish.png",
        config: {
            showsAnswer: true,
            readingAssistance: false,
            advancedStats: true,
            leaderBoard: true,
            fontSize: 0.5,
            sound: 0.5,
            notionsMask: {
                REWRITING: true, // REWRITING: true,
                ADDITION: false, // ADDITION: true,
                SUBSTRACTION: false, // SUBSTRACTION: true,
                MULTIPLICATION: false, // MULTIPLICATION: true,
                DIVISION: false, // DIVISION: true,
                EQUATION: false, // EQUATION: false,
                ENCRYPTION: true, // ENCRYPTION: true,
            },
        },
    }, {
        userId:"u2",
        firstName: "patrick",
        lastName:"BATMAN",
        age: 9,
        icon: "yellow_fish.png",
        config: {
            showsAnswer: false,
            readingAssistance: false,
            advancedStats: false,
            leaderBoard: false,
            fontSize: 0.6,
            sound: 0,
            notionsMask: {
                REWRITING: true,
                ADDITION: true,
                SUBSTRACTION: false,
                MULTIPLICATION: false,
                DIVISION: false,
                EQUATION: false,
                ENCRYPTION: false,
            },
        },
    }, {
        userId:"u3",
        firstName: "Petelo",
        lastName:"WAWAZI",
        age: 9,
        icon: "blue_fish.png",
        config: {
            showsAnswer: true,
            readingAssistance: false,
            advancedStats: true,
            leaderBoard: true,
            fontSize: 0.3,
            sound: 1,
            notionsMask: {
                REWRITING: true,
                ADDITION: true,
                SUBSTRACTION: true,
                MULTIPLICATION: true,
                DIVISION: true,
                EQUATION: false,
                ENCRYPTION: true,
            },
        },
    }, {
        userId:"u4",
        firstName: "Camille",
        lastName:"RITELECU",
        age: 9,
        icon: "turtle.png",
        config: {
            showsAnswer: true,
            readingAssistance: false,
            advancedStats: true,
            leaderBoard: true,
            fontSize: 0.8,
            sound: 0.9,
            notionsMask: {
                REWRITING: true,
                ADDITION: true,
                SUBSTRACTION: true,
                MULTIPLICATION: true,
                DIVISION: true,
                EQUATION: false,
                ENCRYPTION: true,
            },
        },
    },
];



exports.populateUserTable = () => {
    UserTable.reset();
    for (let user of MOCK_USER) {
        UserTable.insert(user);
    }
}