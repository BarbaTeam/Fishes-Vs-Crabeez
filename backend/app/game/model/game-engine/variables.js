"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAYER_COLORS = exports.LANES = void 0;
const lane_1 = require("./lane");
exports.LANES = [
    new lane_1.Lane(1, 10, 49),
    new lane_1.Lane(2, 10, 33),
    new lane_1.Lane(3, 10, 17),
];
exports.PLAYER_COLORS = [
    "red",
    "blue",
    "yellow"
];
