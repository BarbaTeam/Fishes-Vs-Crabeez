const { Router } = require('express');
const UsersRouter = require('./users');
const QuestionRouter = require('./questions');
const LeaderboardRouter = require('./leaderboard');
const GameLeaderboardRouter = require('./game-leaderboard');

const router = new Router();

router.get('/status', (req, res) => res.status(200).json('ok'));
router.use('/users', UsersRouter);
router.use('/questions', QuestionRouter);
router.use('/leaderboard', LeaderboardRouter);
router.use('/gameleaderboard', GameLeaderboardRouter);

module.exports = router;
