const { Router } = require('express');
const Manager = require('./manager')



const router = new Router();


////////////////////////////////////////////////////////////////////////////////
// GET :

router.get('/', (req, res) => {
    try {
        res.status(200).json(Manager.getGameInfos());
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:gameInfoId', (req, res) => {
    try {
        res.status(200).json(Manager.getGameInfoById(req.params.gameInfoId));
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
        res.status(201).json(Manager.insertGameInfo(req.body));
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

router.put('/:gameInfoId', (req, res) => {
    try {
      res.status(201).json(Manager.updateGameInfoById(req.params.gameInfoId, req.body));
    } catch (err) {
      manageAllErrors(res, err);
    }
  });


////////////////////////////////////////////////////////////////////////////////
// DELETE :

router.delete('/:gameInfoId', (req, res) => {
    try {
        Manager.deleteGameInfoById(req.params.gameInfoId);
        res.status(204).end();
    } catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router;