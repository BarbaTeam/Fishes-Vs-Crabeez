import { UserID } from "./ids";
import { UserConfig } from "./user-config.model";

export type User = {
    userId: UserID;
    name: string;
    age: string;
    icon: string;
    userConfig: UserConfig;
}
