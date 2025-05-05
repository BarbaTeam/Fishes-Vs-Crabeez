const Question = require('../../models/question.model');

exports.getQuestions = () => {
    try {
        return Question.get();
    } catch (err) {
        throw new Error(
            `Manager : failed to retrive questions.\n
            Caught : ${err}`
        );
    }
}

exports.getQuestionById = (id) => {
    try {
        return Question.getById(id);
    } catch (err) {
        throw new Error(
            `Manager : failed to retrive question with Id : ${id}.\n
            Caught : ${err}`
        );
    }
}

exports.createQuestion = (question) => {
    try {
        return Question.create({...question});
    } catch (err) {
        throw new Error(
            `Manager : failed to create question.\n
            Caught : ${err}`
        );
    }
}

exports.updateQuestion = (id, question) => {
    try {
        return Question.update(id, question);
    } catch (err) {
        throw new Error(
            `Manager : failed to update question.\n
            Caught : ${err}`
        );
    }
}

exports.deleteQuestion = (id, question) => {
    try {
        return Question.delete(id, question);
    } catch (err) {
        throw new Error(
            `Manager : failed to delete question.\n
            Caught : ${err}`
        );
    }
}

