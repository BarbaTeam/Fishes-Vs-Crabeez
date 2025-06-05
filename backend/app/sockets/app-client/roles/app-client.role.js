const { Server, Socket } = require('socket.io');

const { AppClientRole } = require('./app-client-role.enum');



/**
 * The `State` class
 */
class AppClientRole_Impl {
    /**
     * @param {Server} io
     * @param {Socket} socket
     * @param {(AppClientRole_Impl) => void} changeRole
     */
    constructor(io, socket, changeRole) {
        /**
         * @readonly
         */
        this.io = io;

        /**
         * @readonly
         */
        this.socket = socket;

        /**
         * @private
         * @type {{event: string, handler: Function}[]}
         */
        this._registeredListeners = [];

        /**
         * @private
         * @type {AppClientRole}
         */
        this._role;

        /**
         * @protected
         * @type {(AppClientRole_Impl) => void}
         */
        this.changeRole = changeRole;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Utils :

    /**
     * Util to register and track a listener
     * @protected
     * @param {string} event
     * @param {Function} handler
     */
    _registerListener(event, handler) {
        this.socket.on(event, handler);
        this._registeredListeners.push({ event, handler });
    }

    /**
     * Remove all the listeners that have been registered via `_registerListener()`
     * @protected
     */
    _cleanListeners() {
        for (const { event, handler } of this._registeredListeners) {
            this.socket.off(event, handler);
        }
        this._registeredListeners = [];
    }

    ////////////////////////////////////////////////////////////////////////////
    // Interface :

    /**
     * @abstract
     */
    setUpListeners() {
        throw new Error("Not implemented");
    }

    /**
     * @abstract
     */
    disconnect() {
        throw new Error("Not implemented");
    }

    /**
     * @abstract
     * @returns {AppClientRole}
     */
    get role() {
        throw new Error("Not implemented");
    }
}



module.exports = { AppClientRole_Impl };
