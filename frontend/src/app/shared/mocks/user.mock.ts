import { User } from "../models/user.model";

export const MOCK_USER: User[] = [
    {
        userId:"u1",
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
            encryption: true,
            equation: true,
        }
    }, {
        userId:"u2",
        name: "patrick BATMAN",
        age: "9",
        icon: "yellow_fish.png",
        userConfig: {
            showsAnswer: false,
            readingAssistance: false,
            advancedStats: false,
            leaderBoard: false,
            fontSize: 0.6,
            sound: 0,
            numberRewrite: true,
            addition: true,
            soustraction: false,
            multiplication: false,
            division: false,
            encryption: false,
            equation: false,}
    }, {
        userId:"u3",
        name: "Petelo WAWAZI",
        age: "9",
        icon: "blue_fish.png",
        userConfig: {
            showsAnswer: true,
            readingAssistance: false,
            advancedStats: true,
            leaderBoard: true,
            fontSize: 0.3,
            sound: 1,
            numberRewrite: true,
            addition: true,
            soustraction: true,
            multiplication: true,
            division: true,
            encryption: true,
            equation: true,}
    }, {

        userId:"u4",
        name: "Camille RITELECU",
        age: "9",
        icon: "turtle.png",
        userConfig: {
            showsAnswer: true,
            readingAssistance: false,
            advancedStats: true,
            leaderBoard: true,
            fontSize: 0.8,
            sound: 0.9,
            numberRewrite: true,
            addition: true,
            soustraction: true,
            multiplication: true,
            division: true,
            encryption: true,
            equation: true,}
    }
]
