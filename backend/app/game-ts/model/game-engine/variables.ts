import { Lane } from "./lane";

export const LANES = [
    new Lane(1, 10, 49),
    new Lane(2, 10, 33),
    new Lane(3, 10, 17),
] as const;

export const PLAYER_COLORS = [
    "red",
    "blue",
    "yellow"
] as const;
