import { User } from "../models/user.model";

export const MOCK_USER: User[] = [
    {
        userId:"1",
        name: "Eli KOPTER",
        age: "9",
        icon: "red_fish.png",
        userConfig: {
            showsAnswer: true
        }
    }, {
        userId:"2",
        name: "patrick KOPTER",
        age: "9",
        icon: "yellow_fish.png",
        userConfig: {
            showsAnswer: false
        }
    }, {
        userId:"3",
        name: "lohann KOPTER",
        age: "9",
        icon: "blue_fish.png",
        userConfig: {
            showsAnswer: false
        }
    }, {
        userId:"4",
        name: "juste KOPTER",
        age: "9",
        icon: "turtle.png",
        userConfig: {
            showsAnswer: false
        }
    }
]
