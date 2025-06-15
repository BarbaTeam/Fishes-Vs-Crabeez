import { UserID } from "./ids";
import { QuestionNotion } from "./question.model";



export type PlayerConfig = {
    notionsMask: Record<QuestionNotion, boolean>,
};


export type UserConfig = {
    advancedStats: boolean,
    leaderBoard: boolean,

    showsAnswer: boolean,
    readingAssistance: boolean,

    fontSize: number,
    sound: number,
} & PlayerConfig;


export type User = {
    userId: UserID;
    firstName: string;
    lastName: string;
    age: number;
    icon: string;
    config: UserConfig;
};
