const Leaderboard = require('../../models/leaderboard.model');

exports.getLeaderboards = () => {
    try {
        return Leaderboard.get();
    } catch (err) {
        throw new Error(
            `Manager : failed to retrive leaderboards.\n
            Caught : ${err}`
        );
    }
}

exports.getLeaderboardById = (id) => {
    try {
        return Leaderboard.getById(id);
    } catch (err) {
        throw new Error(
            `Manager : failed to retrive leaderboard with Id : ${id}.\n
            Caught : ${err}`
        );
    }
}

exports.createLeaderboard = (leaderboard) => {
    try {
        return Leaderboard.create({...leaderboard});
    } catch (err) {
        throw new Error(
            `Manager : failed to create leaderboard.\n
            Caught : ${err}`
        );
    }
}

exports.updateLeaderboard = (id, leaderboard) => {
    try {
        return Leaderboard.update(id, leaderboard);
    } catch (err) {
        throw new Error(
            `Manager : failed to update leaderboard.\n
            Caught : ${err}`
        );
    }
}

exports.deleteLeaderboard = (id, leaderboard) => {
    try {
        return Leaderboard.delete(id, leaderboard);
    } catch (err) {
        throw new Error(
            `Manager : failed to delete leaderboard.\n
            Caught : ${err}`
        );
    }
}

