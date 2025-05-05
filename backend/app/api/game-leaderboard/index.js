const { Router } = require('express');
const router = new Router();

const Manager = require('./manager')

////////////////////////////////////////////////////////////////////////////////
// AFFICHER TOUTES LES GAMELEADERBOARD :

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
// CREER UNE GAMELEADERBOARD :

router.post('/', (req, res) =>{
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
// METTRE A JOUR UNE GAMELEADERBOARD :

router.put('/:gameLeaderboardId', (req, res) => {
    try {
      res.status(201).json(Manager.updateGameLeaderboard(req.params.gameLeaderboardId, req.body))
    } catch (err) {
      manageAllErrors(res, err)
    }
  });


////////////////////////////////////////////////////////////////////////////////
// DELETE UNE GAMELEADERBOARD :

router.delete('/:gameLeaderboardId', (req, res) =>{
    try {
        Manager.deleteGameLeaderboard(req.params.gameLeaderboardId);
        res.status(204).end();
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;