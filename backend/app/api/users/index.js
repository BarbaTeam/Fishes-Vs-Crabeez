const { Router } = require('express');
const Manager = require('./manager')



const router = new Router();


////////////////////////////////////////////////////////////////////////////////
// AFFICHER TOUT LES USERS :

router.get('/', (req, res) => {
    try {
        res.status(200).json(Manager.getUsers());
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:userId', (req, res) => {
    try {
        res.status(200).json(Manager.getUserById(req.params.userId));
    } catch (err) {
        res.status(500).json(err);
    }
});

////////////////////////////////////////////////////////////////////////////////
// CREER UN USER :

router.post('/', (req, res) => {
    try {
        res.status(201).json(Manager.createUser(req.body));
    } catch (err) {
        if (err.name === 'ValidationError'){
            res.status(400).json(err.extra);
        } else {
            res.status(500).json(err);
        }
    }
});


////////////////////////////////////////////////////////////////////////////////
// METTRE A JOUR UNE QUESTION :

router.put('/:userId', (req, res) => {
    try {
        res.status(200).json(Manager.updateUserById(req.params.userId, req.body))
    } catch (err) {
        manageAllErrors(res, err)
    }
});


////////////////////////////////////////////////////////////////////////////////
// DELETE UN USER :

router.delete('/:userId', (req, res) => {
    try {
        Manager.deleteUserById(req.params.userId);
        res.status(204).end();
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;