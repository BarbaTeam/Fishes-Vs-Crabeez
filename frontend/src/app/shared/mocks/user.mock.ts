import { User } from "../models/user.model";

export const MOCK_USER: User[] = [
    {
        userId:"1",
        name: "Eli KOPTER",
        age: "9",
        icon: "red_fish.png",
        userConfig: {
            showsAnswer: true,
            readingAssistance: false,
            advancedStats: true,
            leaderBoard: true,
            fontSize: 0.5,
            sound: 0.5,
            numberRewrite: true,
            addition: true,
            soustraction: true,
            multiplication: true,
            division: true,
        }
    }, {
        userId:"2",
        name: "patrick KOPTER",
        age: "9",
        icon: "yellow_fish.png",
        userConfig: {
            showsAnswer: false,
            readingAssistance: false,
            advancedStats: false,
            leaderBoard: false,
            fontSize: 50,
            sound: 100,
            numberRewrite: true,
            addition: true,
            soustraction: false,
            multiplication: false,
            division: false,        }
    }, {
        userId:"3",
        name: "lohann KOPTER",
        age: "9",
        icon: "blue_fish.png",
        userConfig: {
            showsAnswer: true,
            readingAssistance: false,
            advancedStats: true,
            leaderBoard: true,
            fontSize: 20,
            sound: 30,
            numberRewrite: true,
            addition: true,
            soustraction: true,
            multiplication: true,
            division: true,        }
    }, {
        userId:"4",
        name: "juste KOPTER",
        age: "9",
        icon: "turtle.png",
        userConfig: {
            showsAnswer: true,
            readingAssistance: false,
            advancedStats: true,
            leaderBoard: true,
            fontSize: 20,
            sound: 30,
            numberRewrite: true,
            addition: true,
            soustraction: true,
            multiplication: true,
            division: true,        }
    }
]
