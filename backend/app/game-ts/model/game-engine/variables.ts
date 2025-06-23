import { ENEMIES_CRATES_PER_LEVEL } from "./enemies/enemies-crates";
import { Lane } from "./lane";


export const VIRTUAL_WIDTH = 100;
export const VIRTUAL_HEIGHT = VIRTUAL_WIDTH * 9 / 16;

export const bandHeight = VIRTUAL_HEIGHT / 4.787234042553191; //lol c'est pour que chaque lane fasse environ 11.75 unités

export const LANES = [
    new Lane(1, 10, bandHeight * 3.5),
    new Lane(2, 10, bandHeight * 2.5),
    new Lane(3, 10, bandHeight * 1.5),
];


export const PLAYER_COLORS = [
    "red",
    "blue",
    "yellow"
] as const;


export { ENEMIES_CRATES_PER_LEVEL };
