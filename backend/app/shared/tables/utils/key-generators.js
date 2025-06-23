function createSingleKeyGenrator(prop/*: string*/, prefix/*: string*/ = "") {
    return () => ({ [prop]: `${prefix}${Date.now()}` })
}

exports.genUserKey = createSingleKeyGenrator("userId", 'u');
exports.genPlayerKey = createSingleKeyGenrator("playerId", 'u');
exports.genGameKey = createSingleKeyGenrator("gameId", 'g');