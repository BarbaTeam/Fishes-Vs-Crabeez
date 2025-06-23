const { Router } = require('express');
const router = new Router();

const Manager = require('./manager')

////////////////////////////////////////////////////////////////////////////////
// AFFICHER TOUTES LES QUESTIONS :

router.get('/', (req, res) => {
    try {
        res.status(200).json(Manager.getQuestions());
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:questionId', (req, res) => {
    try {
        res.status(200).json(Manager.getQuestionById(req.params.questionId));
    } catch (err) {
        res.status(500).json(err);
    }
});

////////////////////////////////////////////////////////////////////////////////
// CREER UNE QUESTION :

router.post('/', (req, res) =>{
    try {
        res.status(201).json(Manager.createQuestion(req.body));
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

router.put('/:questionId', (req, res) => {
    try {
      res.status(201).json(Manager.updateQuestion(req.params.questionId, req.body))
    } catch (err) {
      manageAllErrors(res, err)
    }
  });


////////////////////////////////////////////////////////////////////////////////
// DELETE UNE QUESTION :

router.delete('/:questionId', (req, res) =>{
    try {
        Manager.deleteQuestion(req.params.questionId);
        res.status(204).end();
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;