const { Router } = require('express');
const router = new Router();

const Manager = require('./manager')

////////////////////////////////////////////////////////////////////////////////
// AFFICHER TOUTES LES LEADERBOARD :

router.get('/', (req, res) => {
    try {
        res.status(200).json(Manager.getLeaderboards());
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:leaderboardId', (req, res) => {
    try {
        res.status(200).json(Manager.getLeaderboardById(req.params.leaderboardId));
    } catch (err) {
        res.status(500).json(err);
    }
});

////////////////////////////////////////////////////////////////////////////////
// CREER UNE LEADERBOARD :

router.post('/', (req, res) =>{
    try {
        res.status(201).json(Manager.createLeaderboard(req.body));
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
// METTRE A JOUR UNE LEADERBOARD :

router.put('/:leaderboardId', (req, res) => {
    try {
      res.status(201).json(Manager.updateLeaderboard(req.params.leaderboardId, req.body))
    } catch (err) {
      manageAllErrors(res, err)
    }
  });


////////////////////////////////////////////////////////////////////////////////
// DELETE UNE LEADERBOARD :

router.delete('/:leaderboardId', (req, res) =>{
    try {
        Manager.deleteLeaderboard(req.params.leaderboardId);
        res.status(204).end();
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;