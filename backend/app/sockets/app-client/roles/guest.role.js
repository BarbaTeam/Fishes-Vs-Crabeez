const { Server, Socket } = require('socket.io');

const { UserTable } = require("../../../shared/tables/user.table");
const { UserID } = require("../../../shared/types");

const { CONNECTED_USERS_ID, userLocks, GUEST_ROOM, CHILD_ROOM, ERGO_ROOM } = require("../app-client.helpers");

const { AppClientRole } = require('./app-client-role.enum');
const { AppClientRole_Impl } = require("./app-client.role");



/**
 * Concrete state for Guests
 */
class GuestRole_Impl extends AppClientRole_Impl {
    /**
     * @param {Server} io
     * @param {Socket} socket
     * @param {(AppClientRole_Impl) => void} changeRole
     */
    constructor(io, socket, changeRole) {
        super(io, socket, changeRole);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Implementation :

    /**
     * @override
     */
    setUpListeners() {
        this._cleanListeners();

        this._registerListener('tryConnectAsErgo', () => {
            // TODO : Adding verif with password
            const canConnectAsErgo = true;
            if (!canConnectAsErgo) {
                this.socket.emit("tryConnectAsErgo_FAILURE");
                return;
            }
            this.connectAsErgo();
            this.socket.emit("tryConnectAsErgo_SUCCESS");
        });

        this._registerListener('requestAvailableUsersId', () => {
            // DEBUG ::
            console.log("Received : 'requestAvailableUsersId'");
            console.log("Sending :");
            console.log(
                UserTable.getAll()
                    .map(user => user.userId)
                    .filter(userId => !CONNECTED_USERS_ID.includes(userId))
            );

            this.socket.emit('availableUsersId',
                UserTable.getAll()
                    .map(user => user.userId)
                    .filter(userId => !CONNECTED_USERS_ID.includes(userId))
            );
        });

        this._registerListener('tryConnectAsChild', (userId) => {
            // Acquire lock for this userId
            if (userLocks.get(userId)) {
                this.socket.emit('tryConnectAsChild_FAILURE');
                return;
            }
            userLocks.set(userId, true);

            try {
                const canConnectAsChild = (
                    !CONNECTED_USERS_ID.includes(userId)  // Guest can only connect as child that aren't yet connected
                    && UserTable.existsByKey({ userId })  // Guest can only connect as child (aka user) that exists in the db
                );
                if (!canConnectAsChild) {
                    this.socket.emit('tryConnectAsChild_FAILURE');
                    return;
                }

                this.connectAsChild(userId);
                this.socket.emit('tryConnectAsChild_SUCCESS');

                CONNECTED_USERS_ID.push(userId);
                this.io.to(GUEST_ROOM).emit('userConnected', userId);
            } finally {
                // Release lock
                userLocks.delete(userId);
            }
        });
    }

    /**
     * @override
     */
    disconnect() {
        this._cleanListeners();
        this.socket.disconnect(true);
    }

    /**
     * @override
     * @returns {AppClientRole}
     */
    get role() {
        return AppClientRole.GUEST;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Transitions :

    /**
     * @private
     * @param {UserID} userId
     */
    connectAsChild(userId) {
        console.log(`[DEBUG :: AppClient::connectAsChild] Client {id=${this.socket.id} ; role=${this.role}} transitionning to CHILD ...`);

        this.socket.leave(GUEST_ROOM);
        this.socket.join(CHILD_ROOM);
        this.socket.join(userId);

        this.changeRole(new (require("./child.role")).ChildRole_Impl(this.io, this.socket, this.changeRole, userId));
    }

    /**
     * @private
     */
    connectAsErgo() {
        console.log(`[DEBUG :: AppClient::connectAsErgo] Client {id=${this.socket.id} ; role=${this.role}} transitionning to ERGO ...`);

        this.socket.leave(GUEST_ROOM);
        this.socket.join(ERGO_ROOM);

        this.changeRole(new (require("./ergo.role")).ErgoRole_Impl(this.io, this.socket, this.changeRole));
    }
}



module.exports = { GuestRole_Impl };
