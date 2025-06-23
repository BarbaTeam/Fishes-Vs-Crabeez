const { Router } = require('express');
const Manager = require('./manager')



const router = new Router();


////////////////////////////////////////////////////////////////////////////////
// GET :

router.get('/', (req, res) => {
    try {
        res.status(200).json(Manager.getPlayersResults());
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:playerId', (req, res) => {
    try {
        const { limit } = req.query;
        res.status(200).json(Manager.getPlayerResultsList(req.params.playerId, limit));
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:playerId/:gameId', (req, res) => {
    try {
        res.status(200).json(Manager.getPlayerResultsByIds(req.params.playerId, req.params.gameId));
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
        res.status(201).json(Manager.insertPlayerResults(req.body));
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

router.put('/:playerId/:gameId', (req, res) => {
    try {
      res.status(201).json(Manager.updatePlayerResultsByIds(req.params.playerId, req.params.gameId, req.body));
    } catch (err) {
      manageAllErrors(res, err);
    }
  });


////////////////////////////////////////////////////////////////////////////////
// DELETE :

router.delete('/:playerId', (req, res) => {
    try {
        Manager.deletePlayerResultsList(req.params.playerId);
        res.status(204).end();
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:playerId/:gameId', (req, res) => {
    try {
        Manager.deletePlayerResultsByIds(req.params.playerId, req.params.gameId);
        res.status(204).end();
    } catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router;