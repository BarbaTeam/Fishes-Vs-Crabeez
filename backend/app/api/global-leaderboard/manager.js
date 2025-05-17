const { GlobalLeaderboardTable } = require('../../shared/tables/global-leaderboard.table');



exports.getGlobalLeaderboard = () => {
    try {
        return GlobalLeaderboardTable.get();
    } catch (err) {
        throw new Error(
            `[GlobalLeaderboard Manager] Get Error : ${err}`
        );
    }
}

exports.updateGlobalLeaderboard = (update) => {
    try {
        return GlobalLeaderboardTable.update(update);
    } catch (err) {
        throw new Error(
            `[GlobalLeaderboard Manager] Update Error : ${err}`
        );
    }
}

exports.resetGlobalLeaderboard = () => {
    try {
        return GlobalLeaderboardTable.reset();
    } catch (err) {
        throw new Error(
            `[GlobalLeaderboard Manager] Reset Error : ${err}`
        );
    }
}

