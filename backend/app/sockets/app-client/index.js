const crypto = require('crypto');
const { Server, Socket } = require('socket.io');

const { AppClientRole } = require("./roles/app-client-role.enum");

const { AppClientRole_Impl } = require("./roles/app-client.role");
const { ChildRole_Impl } = require("./roles/child.role");
const { ErgoRole_Impl } = require("./roles/ergo.role");
const { GameMasterRole_Impl } = require("./roles/game-master.role");
const { GuestRole_Impl } = require("./roles/guest.role");
const { PlayerRole_Impl } = require("./roles/player.role");

const { GUEST_ROOM, CHILD_ROOM, ERGO_ROOM } = require("./app-client.helpers");



// Nettoyage des tokens expirés toutes les 30 secondes
setInterval(cleanExpiredTokens, 30000);



/**
 * AppClient with reconnection support
 */
class AppClient {

    /**
     * @param {Server} io
     * @param {Socket} socket
     * @param {string|null} existingToken - Token pour la reconnexion
     */
    constructor(io, socket, existingToken = null) {
        this.io = io;
        this.socket = socket;

        this._roleImpl = new GuestRole_Impl(this.io, this.socket, (newRoleImpl) => {
            this._roleImpl = newRoleImpl;
            this._roleImpl.setUpListeners();
            this.updateTokenData();
        });

        this._roleImpl.setUpListeners();
        this.socket.join(GUEST_ROOM);

        this.socket.on('tryReconnect', (data) => {
            this.handleReconnection(data.token);
        });
    }

    /**
     * @param {Server} io
     * @param {Socket} socket
     * @param {import('./types').AppClientSnapshot} snapshot
     * @returns {AppClient}
     */
    static fromSnapshot(io, socket, snapshot) {
        client = new AppClient(io, socket);
        client._roleImpl = snapshot.roleImpl;
        return client;
    }

    /**
     * @returns {import('./types').AppClientSnapshot}
     */
    toSnapshot() {
        return {
            expiresAt: Date.now() + 60000, // +1min
            roleImpl: this._roleImpl,
        };
    }

    /**
     * @returns {AppClientRole}
     */
    get role() {
        return this._roleImpl ? this._roleImpl.role : AppClientRole.GUEST;
    }

    /**
     * @returns {string}
     */
    get userId() {
        return this._roleImpl ? this._roleImpl.userId : null;
    }

    /**
     * @returns {string}
     */
    get gameId() {
        return this._roleImpl ? this._roleImpl.gameId : null;
    }

    /**
     * Handle socket disconnection
     */
    disconnect() {
        console.log(`[DEBUG :: AppClient::disconnect] Client {id=${this.socket.id} ; role=${this.role} ; token=${this.token}} disconnecting ...`);

        if (this._roleImpl) {
            this._roleImpl.disconnect();
        }

        // Prolonger la durée de vie du token pour permettre la reconnexion
        if (this.token && tokenMap.has(this.token)) {
            const tokenData = tokenMap.get(this.token);
            tokenData.expiresAt = Date.now() + TOKEN_EXPIRY_TIME;
            console.log(`[DEBUG :: AppClient::disconnect] Token ${this.token} will expire in ${TOKEN_EXPIRY_TIME/1000} seconds`);
        }
    }
}

module.exports = { AppClient, AppClientRole };