////////////////////////////////////////////////////////////////////////////////
// TODO : Removing it once we are (finally) using multithreading

import { GameID } from "../shared/types";
import { GameRuntime } from "./runtime";

export const RUNNING_GAMES: Record<GameID, GameRuntime> = {};
