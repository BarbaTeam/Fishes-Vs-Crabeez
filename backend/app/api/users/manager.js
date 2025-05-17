const { UserTable } = require('../../shared/tables/user.table');



exports.getUsers = () => {
    try {
        return UserTable.getAll();
    } catch (err) {
        throw new Error(
            `[User Manager] Get Error : ${err}`
        );
    }
}

exports.getUserById = (id) => {
    try {
        return UserTable.getByKey({userId: id});
    } catch (err) {
        throw new Error(
            `[User Manager] Get Error : ${err}`
        );
    }
}

exports.createUser = (user) => {
    try {
        UserTable.create({...user})
        return UserTable.getAll().at(-1);
    } catch (err) {
        throw new Error(
            `[User Manager] Create Error : ${err}`
        );
    }
}

exports.updateUserById = (id, update) => {
    try {
        UserTable.updateByKey({userId: id}, update);
        return UserTable.getByKey({userId: id});
    } catch (err) {
        throw new Error(
            `[User Manager] Update Error : ${err}`
        );
    }
}

exports.deleteUserById = (id) => {
    try {
        UserTable.deleteByKey({userId: id});
    } catch (err) {
        throw new Error(
            `[User Manager] Delete Error : ${err}`
        );
    }
}
