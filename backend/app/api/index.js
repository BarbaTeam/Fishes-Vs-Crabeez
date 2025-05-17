const { Router } = require('express');

const GameInfoRouter = require('./game-info');
const GameLeaderboardRouter = require('./game-leaderboard');
const GlobalLeaderboardRouter = require('./global-leaderboard');
const PlayersResultsRouter = require('./player-results');
const PlayersStatisticsRouter = require('./player-statistics');
const UsersRouter = require('./users');



const router = new Router();
router.get('/status', (req, res) => res.status(200).json('ok'));
router.use('/game-infos', GameInfoRouter);
router.use('/game-leaderboards', GameLeaderboardRouter);
router.use('/global-leaderboard', GlobalLeaderboardRouter);
router.use('/player-results', PlayersResultsRouter);
router.use('/player-statistics', PlayersStatisticsRouter);
router.use('/users', UsersRouter);



module.exports = router;
