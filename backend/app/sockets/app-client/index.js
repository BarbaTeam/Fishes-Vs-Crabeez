const { AppClientRole } = require("./roles/app-client-role.enum");
const { AppClientRole_Impl } = require("./roles/app-client.role");
const { GuestRole_Impl } = require("./roles/guest.role");



/**
 * Context :
 */
class AppClient {
    /**
     * @param {Server} io
     * @param {Socket} socket
     */
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;

        /**
         * @private
         * @type {AppClientRole_Impl}
         */
        this._roleImpl = new GuestRole_Impl(io, socket, (newRoleImpl) => {
            this._roleImpl = newRoleImpl;
            this._roleImpl.setUpListeners();
        });
        this._roleImpl.setUpListeners();
        this.socket.join(require("./app-client.helpers").GUEST_ROOM);

        console.log(`[DEBUG :: AppClient::constructor] Client {id=${this.socket.id} ; role=${this.role}} instantiated`);
    }

    /**
     * @returns {AppClientRole}
     */
    get role() {
        return this._roleImpl.role;
    }

    /**
     * Handle socket disconnection
     */
    disconnect() {
        console.log(`[DEBUG :: AppClient::disconnect] Client {id=${this.socket.id} ; role=${this.role}} disconnecting ...`);
        this._roleImpl.disconnect();
    }
}



module.exports = {
    AppClient,
    AppClientRole
};
