"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAYER_COLORS = exports.LANES = exports.bandHeight = exports.VIRTUAL_HEIGHT = exports.VIRTUAL_WIDTH = void 0;
const lane_1 = require("./lane");
exports.VIRTUAL_WIDTH = 100;
exports.VIRTUAL_HEIGHT = exports.VIRTUAL_WIDTH * 9 / 16;
exports.bandHeight = exports.VIRTUAL_HEIGHT / 4.787234042553191; //lol c'est pour que chaque lane fasse environ 11.75 unités
exports.LANES = [
    new lane_1.Lane(1, 10, exports.bandHeight * 3.5),
    new lane_1.Lane(2, 10, exports.bandHeight * 2.5),
    new lane_1.Lane(3, 10, exports.bandHeight * 1.5),
];
exports.PLAYER_COLORS = [
    "red",
    "blue",
    "yellow"
];
