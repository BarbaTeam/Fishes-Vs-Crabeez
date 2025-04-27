import { QuestionNotion } from "../models/question.model";
import { GameLog } from "../models/game-log.model";


export const MOCK_GAMES_LOG: GameLog[] = [

    ////////////////////////////////////////////////////////////////////////////
    // Game 1 :

    {
        gameId: "g1",
        info: {
            playerIds: ["u1", "u2", "u3"],
            date: new Date("2025-04-27T10:30:00.000Z"),
            duration: 6,
            config: {
                maxDuration: 15,
                minNbPlayers: 3,
                maxNbPlayers: 3,
                monstersSpawnRate: 1,
                encrypted: false,
            },
        },
        rawResultsList: [
            // Player 1 :
            [
                // Badly answered :
                {
                    prompt: "1 × 10 =\xa0",
                    expected_answer: "dix",
                    proposed_answer: "dux",
                    notion: QuestionNotion.MULTIPLICATION,
                }, {
                    prompt: "",
                    expected_answer: "}!':\!",
                    proposed_answer: "};';\!",
                    notion: QuestionNotion.ENCRYPTION,
                }, {
                    prompt: "10 + 6 =\xa0",
                    expected_answer: "seize",
                    proposed_answer: "douze",
                    notion: QuestionNotion.ADDITION,
                }, {
                    prompt: "8 + 2 =\xa0",
                    expected_answer: "dix",
                    proposed_answer: "onze",
                    notion: QuestionNotion.ADDITION,
                }, {
                    prompt: "4 - 2 =\xa0",
                    expected_answer: "deux",
                    proposed_answer: "sis",
                    notion: QuestionNotion.SUBSTRACTION,
                }, {
                    prompt: "10 - 9 =\xa0",
                    expected_answer: "un",
                    proposed_answer: "1",
                    notion: QuestionNotion.SUBSTRACTION,
                },

                // Correctly answered :
                {
                    prompt: "18 / 6 =\xa0",
                    expected_answer: "trois",
                    proposed_answer: "trois",
                    notion: QuestionNotion.DIVISION,
                }, {
                    prompt: "40 :\xa0",
                    expected_answer: "quarante",
                    proposed_answer: "quarante",
                    notion: QuestionNotion.REWRITING,
                }, {
                    prompt: "3 - 9 =\xa0",
                    expected_answer: "-six",
                    proposed_answer: "-six",
                    notion: QuestionNotion.SUBSTRACTION,
                }, {
                    prompt: "10 - 9 =\xa0",
                    expected_answer: "un",
                    proposed_answer: "un",
                    notion: QuestionNotion.SUBSTRACTION,
                },
            ],

            // Player 2 :
            [
                // Badly answered :
                {
                    prompt: "8 - 0 =\xa0",
                    expected_answer: "huit",
                    proposed_answer: "huit",
                    notion: "SUBSTRACTION",
                }, {
                    prompt: "4 - 6 =\xa0",
                    expected_answer: "moins deux",
                    proposed_answer: "deux",
                    notion: "SUBSTRACTION",
                }, {
                    prompt: "1 - 6 =\xa0",
                    expected_answer: "moins cinq",
                    proposed_answer: "moins sept",
                    notion: "SUBSTRACTION",
                }, {
                    prompt: "3 - 2 =\xa0",
                    expected_answer: "un",
                    proposed_answer: "un",
                    notion: "SUBSTRACTION",
                }, {
                    prompt: "8 - 10 =\xa0",
                    expected_answer: "moins deux",
                    proposed_answer: "moin deux",
                    notion: "SUBSTRACTION",
                }, {
                    prompt: "9 - 6 =\xa0",
                    expected_answer: "trois",
                    proposed_answer: "cunq",
                    notion: "SUBSTRACTION",
                },

                // Correctly answered :
                {
                    prompt: "0 + 5 =\xa0",
                    expected_answer: "cinq",
                    proposed_answer: "cinq",
                    notion: "ADDITION",
                }, {
                    prompt: "8 - 1 =\xa0",
                    expected_answer: "sept",
                    proposed_answer: "sept",
                    notion: "SUBSTRACTION",
                }, {
                    prompt: "7 - 10 =\xa0",
                    expected_answer: "moins trois",
                    proposed_answer: "moins trois",
                    notion: "SUBSTRACTION",
                }, {
                    prompt: "0 - 5 =\xa0",
                    expected_answer: "moins cinq",
                    proposed_answer: "moins cinq",
                    notion: "SUBSTRACTION",
                }, {
                    prompt: "5 + 3 =\xa0",
                    expected_answer: "huit",
                    proposed_answer: "huit",
                    notion: "ADDITION",
                }, {
                    prompt: "10 - 3 =\xa0",
                    expected_answer: "sept",
                    proposed_answer: "sept",
                    notion: "SUBSTRACTION",
                }, {
                    prompt: "2 + 6 =\xa0",
                    expected_answer: "huit",
                    proposed_answer: "huit",
                    notion: "ADDITION",
                },
            ],

            // Player 3 :
            [
                // Badly answered :
                {
                    prompt: "6 + 9 =\xa0",
                    expected_answer: "quinze",
                    proposed_answer: "quatorse",
                    notion: "ADDITION"
                }, {
                    prompt: "8 + 8 =\xa0",
                    expected_answer: "seize",
                    proposed_answer: "size",
                    notion: "ADDITION"
                },

                // Correctly answered :
                {
                    prompt: "1 + 4 =\xa0",
                    expected_answer: "cinq",
                    proposed_answer: "cinq",
                    notion: "ADDITION"
                }, {
                    prompt: "7 + 5 =\xa0",
                    expected_answer: "douze",
                    proposed_answer: "douze",
                    notion: "ADDITION"
                }, {
                    prompt: "5 + 7 =\xa0",
                    expected_answer: "douze",
                    proposed_answer: "douze",
                    notion: "ADDITION"
                }, {
                    prompt: "1 + 9 =\xa0",
                    expected_answer: "dix",
                    proposed_answer: "dix",
                    notion: "ADDITION"
                }, {
                    prompt: "8 + 7 =\xa0",
                    expected_answer: "quinze",
                    proposed_answer: "quinze",
                    notion: "ADDITION"
                }, {
                    prompt: "1 + 3 =\xa0",
                    expected_answer: "quatre",
                    proposed_answer: "quatre",
                    notion: "ADDITION"
                }, {
                    prompt: "9 + 1 =\xa0",
                    expected_answer: "dix",
                    proposed_answer: "dix",
                    notion: "ADDITION"
                }, {
                    prompt: "10 - 2 =\xa0",
                    expected_answer: "huit",
                    proposed_answer: "huit",
                    notion: "SUBSTRACTION"
                }, {
                    prompt: "7 + 5 =\xa0",
                    expected_answer: "douze",
                    proposed_answer: "douze",
                    notion: "ADDITION"
                }, {
                    prompt: "6 + 3 =\xa0",
                    expected_answer: "neuf",
                    proposed_answer: "neuf",
                    notion: "ADDITION"
                },
            ],
        ],
    },


    ////////////////////////////////////////////////////////////////////////////
    // Game 2 :

    {
        gameId: "g2",
        info: {
            playerIds: ["u2", "u1", "u4"],
            date: new Date("2025-04-28T10:30:00.000Z"),
            duration: 5,
            config: {
                maxDuration: 10,
                minNbPlayers: 3,
                maxNbPlayers: 3,
                monstersSpawnRate: 1,
                encrypted: true,
            },
        },
        rawResultsList: [
            // Player 1 :
            [
                // Badly answered :
                {
                    prompt: "4 - 3 =\xa0",
                    expected_answer: "un",
                    proposed_answer: "one",
                    notion: "SUBSTRACTION",
                }, {
                    prompt: "5 - 9 =\xa0",
                    expected_answer: "moins quatre",
                    proposed_answer: "quatorze",
                    notion: "SUBSTRACTION",
                }, {
                    prompt: "7 - 5 =\xa0",
                    expected_answer: "deux",
                    proposed_answer: "douze",
                    notion: "SUBSTRACTION",
                }, {
                    prompt: "3 - 2 =\xa0",
                    expected_answer: "un",
                    proposed_answer: "",
                    notion: "SUBSTRACTION",
                }, {
                    prompt: "8 - 8 =\xa0",
                    expected_answer: "zéro",
                    proposed_answer: "0",
                    notion: "SUBSTRACTION",
                },

                // Correctly answered :
                {
                    prompt: "6 - 7 =\xa0",
                    expected_answer: "moins un",
                    proposed_answer: "moins un",
                    notion: "SUBSTRACTION",
                }, {
                    prompt: "3 + 10 =\xa0",
                    expected_answer: "treize",
                    proposed_answer: "treize",
                    notion: "ADDITION",
                }, {
                    prompt: "10 - 2 =\xa0",
                    expected_answer: "huit",
                    proposed_answer: "huit",
                    notion: "SUBSTRACTION",
                }, {
                    prompt: "10 - 2 =\xa0",
                    expected_answer: "huit",
                    proposed_answer: "huit",
                    notion: "SUBSTRACTION",
                }, {
                    prompt: "8 - 8 =\xa0",
                    expected_answer: "zéro",
                    proposed_answer: "zéro",
                    notion: "SUBSTRACTION",
                }, {
                    prompt: "7 + 8 =\xa0",
                    expected_answer: "quinze",
                    proposed_answer: "quinze",
                    notion: "ADDITION",
                }, {
                    prompt: "8 + 4 =\xa0",
                    expected_answer: "douze",
                    proposed_answer: "douze",
                    notion: "ADDITION",
                }, {
                    prompt: "5 - 5 =\xa0",
                    expected_answer: "zéro",
                    proposed_answer: "zéro",
                    notion: "SUBSTRACTION",
                }, {
                    prompt: "6 + 6 =\xa0",
                    expected_answer: "douze",
                    proposed_answer: "douze",
                    notion: "ADDITION",
                }, {
                    prompt: "4 - 2 =\xa0",
                    expected_answer: "deux",
                    proposed_answer: "deux",
                    notion: "SUBSTRACTION",
                }, {
                    prompt: "10 + 10 =\xa0",
                    expected_answer: "vingt",
                    proposed_answer: "vingt",
                    notion: "ADDITION",
                },
            ],

            // Player 2 :
            [
                // Badly answered :
                {
                    prompt: "28 :\xa0",
                    expected_answer: "vingt-huit",
                    proposed_answer: "vingt huit",
                    notion: "REWRITING",
                }, {
                    prompt: "4 * 9 =\xa0",
                    expected_answer: "trente-six",
                    proposed_answer: "trente deux",
                    notion: "MULTIPLICATION",
                }, {
                    prompt: "0 :\xa0",
                    expected_answer: "zéro",
                    proposed_answer: "zero",
                    notion: "REWRITING"
                }, {
                    prompt: "0 * 7 =\xa0",
                    expected_answer: "zéro",
                    proposed_answer: "sept",
                    notion: "MULTIPLICATION",
                }, {
                    prompt: "",
                    expected_answer: "^\\/,\"/(}:/",
                    proposed_answer: "^//,\"/(];/",
                    notion: "ENCRYPTION",
                },

                // Correctly answered :
                {
                    prompt: "18 :\xa0",
                    expected_answer: "dix-huit",
                    proposed_answer: "dix-huit",
                    notion: "REWRITING",
                }, {
                    prompt: "41 :\xa0",
                    expected_answer: "quarante et un",
                    proposed_answer: "quarante et un",
                    notion: "REWRITING",
                }, {
                    prompt: "3 + 10 =\xa0",
                    expected_answer: "treize",
                    proposed_answer: "treize",
                    notion: "ADDITION",
                },
            ],

            // Player 3 :
            [
                // Badly answered :
                {
                    prompt: "",
                    expected_answer: "=^>}]*<<\"@",
                    proposed_answer: "=^>}]*<\"@",
                    notion: "ENCRYPTION"
                }, {
                    prompt: "27 :\xa0",
                    expected_answer: "vingt-sept",
                    proposed_answer: "vingt sept",
                    notion: "REWRITING"
                }, {
                    prompt: "0 + 5 =\xa0",
                    expected_answer: "cinq",
                    proposed_answer: "moins cinq",
                    notion: "ADDITION"
                }, {
                    prompt: "4 * 6 =\xa0",
                    expected_answer: "vingt-quatre",
                    proposed_answer: "vingt-huit",
                    notion: "MULTIPLICATION"
                }, {
                    prompt: "",
                    expected_answer: "|['<&_#;,#",
                    proposed_answer: "|('<&_#;,#",
                    notion: "ENCRYPTION"
                }, {
                    prompt: "5 * 1 =\xa0",
                    expected_answer: "cinq",
                    proposed_answer: "cunq",
                    notion: "MULTIPLICATION"
                }, {
                    prompt: "3 + 9 =\xa0",
                    expected_answer: "douze",
                    proposed_answer: "onze",
                    notion: "ADDITION"
                }, {
                    prompt: "1 - 6 =\xa0",
                    expected_answer: "moins cinq",
                    proposed_answer: "moin cinq",
                    notion: "SUBSTRACTION"
                }, {
                    prompt: "3 + 10 =\xa0",
                    expected_answer: "treize",
                    proposed_answer: "traize",
                    notion: "ADDITION"
                },

                // Correctly answered :
                {
                    prompt: "1 :\xa0",
                    expected_answer: "un",
                    proposed_answer: "un",
                    notion: "REWRITING"
                }, {
                    prompt: "1 * 1 =\xa0",
                    expected_answer: "un",
                    proposed_answer: "un",
                    notion: "MULTIPLICATION"
                }, {
                    prompt: "",
                    expected_answer: "^<!;]`|_-",
                    proposed_answer: "^<!;]`|_-",
                    notion: "ENCRYPTION"
                }, {
                    prompt: "2 + 3 =\xa0",
                    expected_answer: "cinq",
                    proposed_answer: "cinq",
                    notion: "ADDITION"
                }, {
                    prompt: "4 - 5 =\xa0",
                    expected_answer: "moins un",
                    proposed_answer: "moins un",
                    notion: "SUBSTRACTION"
                }, {
                    prompt: "4 + 0 =\xa0",
                    expected_answer: "quatre",
                    proposed_answer: "quatre",
                    notion: "ADDITION"
                }, {
                    prompt: "8 :\xa0",
                    expected_answer: "huit",
                    proposed_answer: "huit",
                    notion: "REWRITING"
                }, {
                    prompt: "1 * 3 =\xa0",
                    expected_answer: "trois",
                    proposed_answer: "trois",
                    notion: "MULTIPLICATION"
                }, {
                    prompt: "4 + 9 =\xa0",
                    expected_answer: "treize",
                    proposed_answer: "treize",
                    notion: "ADDITION"
                }, {
                    prompt: "18 :\xa0",
                    expected_answer: "dix-huit",
                    proposed_answer: "dix-huit",
                    notion: "REWRITING"
                }
            ]
        ],
    },
];


/* TODO : One day :finger_crossed:
////////////////////////////////////////////////////////////////////////////////
// Game 3 :
////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////
    // Player 1 :

    // TODO : ...


    ////////////////////////////////////////////////////////////////////////////
    // Player 2 :

    // TODO : ...

    ////////////////////////////////////////////////////////////////////////////
    // Player 3 :

    // TODO : ...



////////////////////////////////////////////////////////////////////////////////
// Game 4 :
////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////
    // Player 1 :

    // TODO : ...


    ////////////////////////////////////////////////////////////////////////////
    // Player 2 :

    // TODO : ...

    ////////////////////////////////////////////////////////////////////////////
    // Player 3 :

    // TODO : ...



////////////////////////////////////////////////////////////////////////////////
// Game 5 :
////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////
    // Player 1 :

    // TODO : ...


    ////////////////////////////////////////////////////////////////////////////
    // Player 2 :

    // TODO : ...

    ////////////////////////////////////////////////////////////////////////////
    // Player 3 :

    // TODO : ...
*/
