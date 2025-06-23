const { Router } = require('express');
const Manager = require('./manager')



const router = new Router();


// NOTE : As GlobalLeaderbord is a singleton, `POST` request nor request using id are supported.


////////////////////////////////////////////////////////////////////////////////
// GET :

router.get('/', (req, res) => {
    try {
        res.status(200).json(Manager.getGlobalLeaderboard());
    } catch (err) {
        res.status(500).json(err);
    }
});



////////////////////////////////////////////////////////////////////////////////
// DEBUG ::
// NOTE : Those API call should not be used outside of debug purposes.
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// PUT :

router.put('/', (req, res) => {
    try {
      res.status(201).json(Manager.updateGlobalLeaderboard(req.body))
    } catch (err) {
      manageAllErrors(res, err)
    }
});


////////////////////////////////////////////////////////////////////////////////
// DELETE :

router.delete('/', (req, res) => {
    try {
        Manager.resetGlobalLeaderboard();
        res.status(204).end();
    } catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router;