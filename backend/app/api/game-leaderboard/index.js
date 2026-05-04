const { Router } = require('express');
const Manager = require('./manager')



const router = new Router();


////////////////////////////////////////////////////////////////////////////////
// GET :

router.get('/', (req, res) => {
    try {
        res.status(200).json(Manager.getGameLeaderboards());
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:gameLeaderboardId', (req, res) => {
    try {
        res.status(200).json(Manager.getGameLeaderboardById(req.params.gameLeaderboardId));
    } catch (err) {
        res.status(500).json(err);
    }
});



////////////////////////////////////////////////////////////////////////////////
// DEBUG ::
// NOTE : Those API call should not be used outside of debug purposes.
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// POST :

router.post('/', (req, res) => {
    try {
        res.status(201).json(Manager.createGameLeaderboard(req.body));
    } catch (err) {
        if (err.name === 'ValidationError'){
            res.status(400).json(err.extra);
        } else {
            console.log(err);
            res.status(500).json(err);
        }
    }
});


////////////////////////////////////////////////////////////////////////////////
// PUT :

router.put('/:gameLeaderboardId', (req, res) => {
    try {
        res.status(201).json(Manager.updateGameLeaderboardById(req.params.gameLeaderboardId, req.body));
    } catch (err) {
        manageAllErrors(res, err);
    }
});


////////////////////////////////////////////////////////////////////////////////
// DELETE :

router.delete('/:gameLeaderboardId', (req, res) => {
    try {
        Manager.deleteGameLeaderboardById(req.params.gameLeaderboardId);
        res.status(204).end();
    } catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router;
