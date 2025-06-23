const { Router } = require('express');
const Manager = require('./manager')



const router = new Router();


////////////////////////////////////////////////////////////////////////////////
// GET :

router.get('/', (req, res) => {
    try {
        res.status(200).json(Manager.getPlayersStatistics());
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:playerId', (req, res) => {
    try {
        res.status(200).json(Manager.getPlayerStatisticsById(req.params.playerId));
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
        res.status(201).json(Manager.createPlayerStatistics(req.body));
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

router.put('/:playerId', (req, res) => {
    try {
      res.status(201).json(Manager.updatePlayerStatisticsById(req.params.playerId, req.body));
    } catch (err) {
      manageAllErrors(res, err);
    }
  });


////////////////////////////////////////////////////////////////////////////////
// DELETE :

router.delete('/:playerId', (req, res) => {
    try {
        Manager.deletePlayerStatisticsById(req.params.playerId);
        res.status(204).end();
    } catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router;