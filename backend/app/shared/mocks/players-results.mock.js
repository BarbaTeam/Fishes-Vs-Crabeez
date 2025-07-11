const { PlayerResultsTable } = require('../tables/player-results.table')


// How it was made :
// =================
// - (auto)   generating a list of random questions of length btwn 6..20
// - (manual) writing raw results based on the list of questions
// - (auto)   refining the raw results into results
// - (manual) assigning the results to a specific player at a specific game

const MOCK_PLAYERS_RESULTS = [

////////////////////////////////////////////////////////////////////////////////
// Game 1 :
////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////
    // Player 1 :

    {
        playerId: "u1",
        gameId: "g1",
        answersShown: true,
        results: {
            wordsPerMinute: 1.6666666666666667,
            globalGrading: { grade: "A" , accuracy: 70 },
            gradingPerNotion: {
                ADDITION      : { grade: "A" , accuracy: 70 },
                SUBSTRACTION  : { grade: "B" , accuracy: 60 },
                MULTIPLICATION: { grade: "A" , accuracy: 80 },
                DIVISION      : { grade: "A", accuracy: 100 },
                EQUATION      : { grade: "XF", accuracy: 0 },
                REWRITING     : { grade: "A", accuracy: 80 },
                ENCRYPTION    : { grade: "C" , accuracy: 30 },
            },
            mistakes: {
                spelling: [
                    {
                        prompt: "4 - 2 =\xa0",
                        expected_answer: "deux",
                        proposed_answer: "sis",
                        notion: "SUBSTRACTION",
                    }, {
                        prompt: "10 - 9 =\xa0",
                        expected_answer: "un",
                        proposed_answer: "1",
                        notion: "SUBSTRACTION",
                    }, {
                        prompt: "1 × 10 =\xa0",
                        expected_answer: "dix",
                        proposed_answer: "dux",
                        notion: "MULTIPLICATION",
                    }, {
                        prompt: "",
                        expected_answer: "}!':!",
                        proposed_answer: "};';!",
                        notion: "ENCRYPTION",
                    }
                ],
                calculation: [
                    {
                        prompt: "10 + 6 =\xa0",
                        expected_answer: "seize",
                        proposed_answer: "douze",
                        notion: "ADDITION",
                    }, {
                        prompt: "8 + 2 =\xa0",
                        expected_answer: "dix",
                        proposed_answer: "onze",
                        notion: "ADDITION",
                    },
                ],
            },

            score: 0,

            kills: {
                CRAB: 0,
                HIVECRAB: 0,
                DRONE: 0,
                PAPA: 0,
            },
        },
    },


    ////////////////////////////////////////////////////////////////////////////
    // Player 2 :

    {
        playerId: "u2",
        gameId: "g1",
        answersShown: false,
        results: {
            wordsPerMinute: 2.1666666666666665,
            globalGrading: { grade: "B", accuracy: 65 },
            gradingPerNotion: {
                ADDITION      : { grade: "A", accuracy: 70 },
                SUBSTRACTION  : { grade: "B", accuracy: 60 },
                MULTIPLICATION: { grade: "XF", accuracy: 0 },
                DIVISION      : { grade: "XF", accuracy: 0 },
                EQUATION      : { grade: "XF", accuracy: 0 },
                REWRITING     : { grade: "XF", accuracy: 0 },
                ENCRYPTION    : { grade: "XF", accuracy: 0 },
            },
            mistakes: {
                spelling: [
                    {
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
                ],
                calculation: [
                    {
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
                        prompt: "9 - 6 =\xa0",
                        expected_answer: "trois",
                        proposed_answer: "cunq",
                        notion: "SUBSTRACTION",
                    },
                ],
            },

            score: 0,

            kills: {
                CRAB: 0,
                HIVECRAB: 0,
                DRONE: 0,
                PAPA: 0,
            },
        },
    },


    ////////////////////////////////////////////////////////////////////////////
    // Player 3 :

    {
        playerId: "u3",
        gameId: "g1",
        answersShown: false,
        results: {
            wordsPerMinute: 2,
            globalGrading: { grade: "B", accuracy: 83.33333333333334 },
            gradingPerNotion: {
                ADDITION:      { grade: "B", accuracy: 81.81818181818183 },
                SUBSTRACTION:  { grade: "A", accuracy: 100 },
                MULTIPLICATION:{ grade: "XF", accuracy: 0 },
                DIVISION:      { grade: "XF", accuracy: 0 },
                EQUATION:      { grade: "XF", accuracy: 0 },
                REWRITING:     { grade: "XF", accuracy: 0 },
                ENCRYPTION:    { grade: "XF", accuracy: 0 },
            },
            mistakes: {
                spelling: [
                    {
                        prompt: "6 + 9 =\xa0",
                        expected_answer: "quinze",
                        proposed_answer: "quatorse",
                        notion: "ADDITION",
                    }, {
                        prompt: "8 + 8 =\xa0",
                        expected_answer: "seize",
                        proposed_answer: "size",
                        notion: "ADDITION",
                    }
                ],
                calculation: [
                    {
                        prompt: "6 + 9 =\xa0",
                        expected_answer: "quinze",
                        proposed_answer: "quatorse",
                        notion: "ADDITION",
                    }, {
                        prompt: "8 + 8 =\xa0",
                        expected_answer: "seize",
                        proposed_answer: "size",
                        notion: "ADDITION",
                    },
                ],
            },

            score: 0,

            kills: {
                CRAB: 0,
                HIVECRAB: 0,
                DRONE: 0,
                PAPA: 0,
            },
        },
    },



////////////////////////////////////////////////////////////////////////////////
// Game 2 :
////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////
    // Player 1 :

    {
        playerId: "u2",
        gameId: "g2",
        answersShown: false,
        results: {
            wordsPerMinute: 3.2,
            globalGrading: { grade: "D", accuracy: 68.75 },
            gradingPerNotion: {
                ADDITION      : { grade: "A", accuracy: 100 },
                SUBSTRACTION  : { grade: "B" , accuracy: 54.54545454545455 },
                MULTIPLICATION: { grade: "XF", accuracy: 0 },
                DIVISION      : { grade: "XF", accuracy: 0 },
                EQUATION      : { grade: "XF", accuracy: 0 },
                REWRITING     : { grade: "XF", accuracy: 0 },
                ENCRYPTION    : { grade: "XF", accuracy: 0 },
            },
            mistakes: {
                spelling: [
                    {
                        prompt: "4 - 3 =\xa0",
                        expected_answer: "un",
                        proposed_answer: "one",
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
                    }
                ],
                calculation: [
                    {
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
                    },
                ],
            },

            score: 0,

            kills: {
                CRAB: 0,
                HIVECRAB: 0,
                DRONE: 0,
                PAPA: 0,
            },
        },
    },


    ////////////////////////////////////////////////////////////////////////////
    // Player 2 :

    {
        playerId: "u1",
        gameId: "g2",
        answersShown: true,
        results: {
            wordsPerMinute: 1.6,
            globalGrading: { grade: "B", accuracy: 60 },
            gradingPerNotion: {
                ADDITION      : { grade: "B" , accuracy: 60 },
                SUBSTRACTION  : { grade: "A" , accuracy: 80 },
                MULTIPLICATION: { grade: "A" , accuracy: 70 },
                DIVISION      : { grade: "B", accuracy: 40 },
                EQUATION      : { grade: "XF", accuracy: 0 },
                REWRITING     : { grade: "A", accuracy: 80 },
                ENCRYPTION    : { grade: "C" , accuracy: 30 },
            },
            mistakes: {
                spelling: [
                    {
                        prompt: "4 × 9 =\xa0",
                        expected_answer: "trente-six",
                        proposed_answer: "trente deux",
                        notion: "MULTIPLICATION",
                    }, {
                        prompt: "28 :\xa0",
                        expected_answer: "vingt-huit",
                        proposed_answer: "vingt huit",
                        notion: "REWRITING",
                    }, {
                        prompt: "0 :\xa0",
                        expected_answer: "zéro",
                        proposed_answer: "zero",
                        notion: "REWRITING",
                    }, {
                        prompt: "",
                        expected_answer: "^\\/,\"/(}:/",
                        proposed_answer: "^//,\"/(];/",
                        notion: "ENCRYPTION",
                    },
                ],
                calculation: [
                    {
                        prompt: "4 × 9 =\xa0",
                        expected_answer: "trente-six",
                        proposed_answer: "trente deux",
                        notion: "MULTIPLICATION",
                    }, {
                        prompt: "0 × 7 =\xa0",
                        expected_answer: "zéro",
                        proposed_answer: "sept",
                        notion: "MULTIPLICATION",
                    },
                ],
            },

            score: 0,

            kills: {
                CRAB: 0,
                HIVECRAB: 0,
                DRONE: 0,
                PAPA: 0,
            },
        },
    },


    ////////////////////////////////////////////////////////////////////////////
    // Player 3 :

    {
        playerId: "u4",
        gameId: "g2",
        answersShown: true,
        results: {
            wordsPerMinute: 3.8,
            globalGrading: { grade: "D", accuracy: 9 },
            gradingPerNotion: {
                ADDITION      : { grade: "D", accuracy: 9 },
                SUBSTRACTION  : { grade: "D", accuracy: 9 },
                MULTIPLICATION: { grade: "D", accuracy: 9 },
                DIVISION      : { grade: "XF", accuracy: 0 },
                EQUATION      : { grade: "XF", accuracy: 0 },
                REWRITING     : { grade: "D", accuracy: 9 },
                ENCRYPTION    : { grade: "D", accuracy: 9 },
            },
            mistakes: {
                spelling: [
                    {
                        prompt: "3 + 10 = ",
                        expected_answer: "treize",
                        proposed_answer: "traize",
                        notion: "ADDITION",
                    }, {
                        prompt: "1 - 6 = ",
                        expected_answer: "moins cinq",
                        proposed_answer: "moin cinq",
                        notion: "SUBSTRACTION",
                    }, {
                        prompt: "5 * 1 = ",
                        expected_answer: "cinq",
                        proposed_answer: "cunq",
                        notion: "MULTIPLICATION",
                    }, {
                        prompt: "27 : ",
                        expected_answer: "vingt-sept",
                        proposed_answer: "vingt sept",
                        notion: "REWRITING",
                    }, {
                        prompt: "",
                        expected_answer: "=^>}]*<<\"@",
                        proposed_answer: "=^>}]*<\"@",
                        notion: "ENCRYPTION",
                    }, {
                        prompt: "",
                        expected_answer: "|['<&_#;,#",
                        proposed_answer: "|('<&_#;,#",
                        notion: "ENCRYPTION",
                    }
                ],
                calculation: [
                    {
                        prompt: "0 + 5 = ",
                        expected_answer: "cinq",
                        proposed_answer: "moins cinq",
                        notion: "ADDITION",
                    }, {
                        prompt: "3 + 9 = ",
                        expected_answer: "douze",
                        proposed_answer: "onze",
                        notion: "ADDITION",
                    }, {
                        prompt: "4 * 6 = ",
                        expected_answer: "vingt-quatre",
                        proposed_answer: "vingt-huit",
                        notion: "MULTIPLICATION",
                    },
                ],
            },

            score: 0,

            kills: {
                CRAB: 0,
                HIVECRAB: 0,
                DRONE: 0,
                PAPA: 0,
            },
        },
    },


/* TODO : One day :fingers_crossed:
////////////////////////////////////////////////////////////////////////////////
// Game 3 :
////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////
    // Player 1 :

    {
        playerId: "u1",
        gameId: "g3",
        answersShown: true,
        results: // TODO : ...
    },


    ////////////////////////////////////////////////////////////////////////////
    // Player 2 :

    {
        playerId: "u2",
        gameId: "g3",
        answersShown: true,
        results: // TODO : ...
    },


    ////////////////////////////////////////////////////////////////////////////
    // Player 3 :

    {
        playerId: "u3",
        gameId: "g3",
        answersShown: true,
        results: // TODO : ...
    },



////////////////////////////////////////////////////////////////////////////////
// Game 4 :
////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////
    // Player 1 :

    {
        playerId: "u1",
        gameId: "g4",
        answersShown: true,
        results: // TODO : ...
    },


    ////////////////////////////////////////////////////////////////////////////
    // Player 2 :

    {
        playerId: "u2",
        gameId: "g4",
        answersShown: true,
        results: // TODO : ...
    },


    ////////////////////////////////////////////////////////////////////////////
    // Player 3 :

    {
        playerId: "u3",
        gameId: "g4",
        answersShown: true,
        results: // TODO : ...
    },



////////////////////////////////////////////////////////////////////////////////
// Game 5 :
////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////
    // Player 1 :

    {
        playerId: "u1",
        gameId: "g5",
        answersShown: true,
        results: // TODO : ...
    },


    ////////////////////////////////////////////////////////////////////////////
    // Player 2 :

    {
        playerId: "u2",
        gameId: "g5",
        answersShown: true,
        results: // TODO : ...
    },


    ////////////////////////////////////////////////////////////////////////////
    // Player 3 :

    {
        playerId: "u3",
        gameId: "g5",
        answersShown: true,
        results: // TODO : ...
    },
*/
];



exports.populatePlayerResultsTable = () => {
    PlayerResultsTable.reset();
    for (let playerResults of MOCK_PLAYERS_RESULTS) {
        PlayerResultsTable.insert(playerResults);
    }
}