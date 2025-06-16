const { AppClientRole } = require("./roles/app-client-role.enum");
const { AppClientRole_Impl } = require("./roles/app-client.role");
const { ChildRole_Impl } = require("./roles/child.role");
const { ErgoRole_Impl } = require("./roles/ergo.role");
const { GameMasterRole_Impl } = require("./roles/game-master.role");
const { GuestRole_Impl } = require("./roles/guest.role");
const { PlayerRole_Impl } = require("./roles/player.role");
const crypto = require('crypto');

const tokenMap = new Map(); // stock le token et les données du client
const TOKEN_EXPIRY_TIME = 60 * 1000; // 1 minute

function generateToken(socketId) {
    const timestamp = Date.now();
    const hash = crypto.createHash('sha256')
        .update(socketId + timestamp.toString())
        .digest('hex');
    return hash.substring(0, 32); // Token de 32 caractères
}

function cleanExpiredTokens() {
    const now = Date.now();
    for (const [token, data] of tokenMap.entries()) {
        if (now > data.expiresAt) {
            tokenMap.delete(token);
            console.log(`[DEBUG :: TokenManager] Token ${token} expired and removed`);
        }
    }
}

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
        this.token = null;

        if (existingToken && this.validateAndRestoreFromToken(existingToken)) {
            console.log(`[DEBUG :: AppClient::constructor] Client reconnected with token ${existingToken}`);
            this.socket.emit('reconnection_success', { 
                token: this.token,
                role: this.role,
                userId: this.userId,
                gameId: this.gameId 
            });
        } else {
            this.initializeNewClient();
        }
    }

    /**
     * Gère les tentatives de reconnexion
     */
    handleReconnection(token) {
        if (token && this.validateAndRestoreFromToken(token)) {
            console.log(`[DEBUG :: AppClient::handleReconnection] Reconnection successful with token ${token}`);
            this.socket.emit('reconnection_success', { 
                token: this.token,
                role: this.role,
                userId: this.userId,
                gameId: this.gameId 
            });
        } else {
            console.log(`[DEBUG :: AppClient::handleReconnection] Reconnection failed, creating new client`);
            this.initializeNewClient();
            this.socket.emit('reconnection_failed', { reason: 'Invalid or expired token' });
        }
    }

    initializeNewClient() {
        this.token = generateToken(this.socket.id);
        
        this._roleImpl = new GuestRole_Impl(this.io, this.socket, (newRoleImpl) => {
            this._roleImpl = newRoleImpl;
            this._roleImpl.setUpListeners();
            this.updateTokenData();
        });
        
        this._roleImpl.setUpListeners();
        this.socket.join(require("./app-client.helpers").GUEST_ROOM);

        this.storeTokenData();

        this.socket.emit('token_assigned', { token: this.token });

        console.log(`[DEBUG :: AppClient::constructor] New client {id=${this.socket.id} ; role=${this.role} ; token=${this.token}} instantiated`);
    }

    validateAndRestoreFromToken(token) {
        const tokenData = tokenMap.get(token);
        
        if (!tokenData) {
            console.log(`[DEBUG :: AppClient::validateAndRestoreFromToken] Token ${token} not found`);
            return false;
        }

        if (Date.now() > tokenData.expiresAt) {
            tokenMap.delete(token);
            console.log(`[DEBUG :: AppClient::validateAndRestoreFromToken] Token ${token} expired`);
            return false;
        }

        this.token = token;
        this.restoreRoleFromTokenData(tokenData);
        
        // Mettre à jour les données du token avec le nouveau socket
        tokenData.socketId = this.socket.id;
        tokenData.expiresAt = Date.now() + TOKEN_EXPIRY_TIME;
        
        console.log(`[DEBUG :: AppClient::validateAndRestoreFromToken] Client restored from token ${token} with role ${tokenData.role}`);
        return true;
    }

    restoreRoleFromTokenData(tokenData) {
        // Quitter toutes les rooms actuelles sauf la room par défaut
        const rooms = Array.from(this.socket.rooms);
        rooms.forEach(room => {
            if (room !== this.socket.id) {
                this.socket.leave(room);
            }
        });

        switch (tokenData.role) {
            case AppClientRole.CHILD:
                this._roleImpl = new ChildRole_Impl(this.io, this.socket, (newRoleImpl) => {
                    this._roleImpl = newRoleImpl;
                    this._roleImpl.setUpListeners();
                    this.updateTokenData();
                }, tokenData.userId);
                this._roleImpl.setUpListeners();

                this.socket.join(require("./app-client.helpers").CHILD_ROOM);
                if (tokenData.userId) {
                    this.socket.join(tokenData.userId);
                }
                break;
            case AppClientRole.PLAYER:
                this._roleImpl = new PlayerRole_Impl(this.io, this.socket, (newRoleImpl) => {
                    this._roleImpl = newRoleImpl;
                    this._roleImpl.setUpListeners();
                    this.updateTokenData();
                }, tokenData.userId, tokenData.gameId);
                this._roleImpl.setUpListeners();

                this.socket.join(require("./app-client.helpers").CHILD_ROOM);
                if (tokenData.userId) {
                    this.socket.join(tokenData.userId);
                }
                if (tokenData.gameId) {
                    this.socket.join(tokenData.gameId);
                }
                break;
            case AppClientRole.ERGO:
                this._roleImpl = new ErgoRole_Impl(this.io, this.socket, (newRoleImpl) => {
                    this._roleImpl = newRoleImpl;
                    this._roleImpl.setUpListeners();
                    this.updateTokenData();
                });
                this._roleImpl.setUpListeners();
                this.socket.join(require("./app-client.helpers").ERGO_ROOM);
                break;
            case AppClientRole.GAME_MASTER:
                this._roleImpl = new GameMasterRole_Impl(this.io, this.socket, (newRoleImpl) => {
                    this._roleImpl = newRoleImpl;
                    this._roleImpl.setUpListeners();
                    this.updateTokenData();
                }, tokenData.gameId);
                this._roleImpl.setUpListeners();
                this.socket.join(require("./app-client.helpers").ERGO_ROOM);
                if (tokenData.gameId) {
                    this.socket.join(tokenData.gameId);
                }
                break;
            default:
                this._roleImpl = new GuestRole_Impl(this.io, this.socket, (newRoleImpl) => {
                    this._roleImpl = newRoleImpl;
                    this._roleImpl.setUpListeners();
                    this.updateTokenData();
                });
                this._roleImpl.setUpListeners();
                this.socket.join(require("./app-client.helpers").GUEST_ROOM);
        }
    }

    storeTokenData() {
        tokenMap.set(this.token, {
            socketId: this.socket.id,
            role: this.role,
            userId: this.userId,
            gameId: this.gameId,
            createdAt: Date.now(),
            expiresAt: Date.now() + TOKEN_EXPIRY_TIME
        });
    }

    updateTokenData() {
        if (this.token && tokenMap.has(this.token)) {
            const tokenData = tokenMap.get(this.token);
            tokenData.role = this.role;
            tokenData.userId = this.userId;
            tokenData.gameId = this.gameId;
            tokenData.expiresAt = Date.now() + TOKEN_EXPIRY_TIME; 
        }
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