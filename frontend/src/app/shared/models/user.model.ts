import { UserConfig } from "./user-config.model";

export type User = {
    userId: string;
    name: string;
    age: string;
    icon: string;
    userConfig: UserConfig;
}