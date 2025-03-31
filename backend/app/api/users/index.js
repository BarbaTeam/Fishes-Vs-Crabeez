const { Router } = require('express');
const User = require('../../models/user.model');

const router = new Router();


////////////////////////////////////////////////////////////////////////////////
// AFFICHER TOUT LES USERS :

router.get('/', (req, res) => {
    try {
        res.status(200).json(User.get());
    } catch (err) {
        res.status(500).json(err);
    }
});


////////////////////////////////////////////////////////////////////////////////
// CREER UN USER :

router.post('/', (req, res) =>{
    try {
        const user = User.create({ ...req.body });
        res.status(201).json(user);
    } catch (err) {
        if (err.name === 'ValidationError'){
            res.status(400).json(err.extra);
        } else {
            res.status(500).json(err);
        }
    }
});

////////////////////////////////////////////////////////////////////////////////
// DELETE UN USER :

router.delete('/:userId', (req, res) =>{
    try {
        User.delete(req.params.userId);
        res.status(204).end();
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;