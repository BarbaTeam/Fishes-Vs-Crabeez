const User = require('../../models/user.model');

exports.getUsers = () => {
    try {
        return User.get();
    } catch (err) {
        throw new Error(
            `Manager : failed to retrive users.\n
            Caught : ${err}`
        );
    }
}

exports.getUserById = (id) => {
    try {
        return User.getById(id);
    } catch (err) {
        throw new Error(
            `Manager : failed to retrive user with Id : ${id}.\n
            Caught : ${err}`
        );
    }
}

exports.createUser = (user) => {
    try {
        return User.create({...user});
    } catch (err) {
        throw new Error(
            `Manager : failed to create user.\n
            Caught : ${err}`
        );
    }
}

exports.updateUser = (id, user) => {
    try {
        return User.update(id, user);
    } catch (err) {
        throw new Error(
            `Manager : failed to update user.\n
            Caught : ${err}`
        );
    }
}

exports.deleteUser = (id, user) => {
    try {
        return User.delete(id, user);
    } catch (err) {
        throw new Error(
            `Manager : failed to delete user.\n
            Caught : ${err}`
        );
    }
}

