# Realtime Communication `Client <--> Server`


## Introduction

For realtime interactions, we use the following libraries :
- `socket-io` for the backend
- `ngx-socket-io` for the frontend

The client changes role based on its interactions with the app.  
Initially a client is a **GUEST** but can evolve into a **CHILD** or an **ERGO**.

**CHILD** takes the subrole **PLAYER** when playing a game or waiting in a game lobby.  
**ERGO** takes the subrole **GAME_MASTER** when spectating a game or a game lobby.

A client is represented as an instance of the `AppClient` class in the backend.  
Those instances follow the lifecycle :  
![`AppClient` Lifecycle](./images/AppClient-Lifecycle.png)



<br/><br/>
--------------------------------------------------------------------------------
<br/><br/>


<style>
td {
    vertical-align: top;
}
</style>

## List of events per roles

### GUEST

<table>
<tr>

<td>

## Events &emsp;*sent by the server*&emsp; to the client

|Event                         |DataType     |
|:----------------------------:|:-----------:|
|`'availableUsersId'`          |`UserID[]`   |
|`'userConnected'`             |`UserID`     |
|`'userDisconnected'`          |`UserID`     |
|                              |             |
|`'tryConnectAsErgo_SUCCESS '` |`void`       |
|`'tryConnectAsErgo_FAILURE '` |`void`       |
|`'tryConnectAsChild_SUCCESS '`|`void`       |
|`'tryConnectAsChild_FAILURE '`|`void`       |
<br>


</td>

<td>

## Events &emsp;*sent by the client*&emsp; to the server

|Event                         |DataType     |
|:----------------------------:|:-----------:|
|`'requestAvailableUsersId'`   |`void`       |
|`'tryConnectAsErgo'`          |`UserID`     |
|`'tryConnectAsChild'`         |`UserID`     |
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>


</td>


</tr>
</table>



### CHILD & PLAYER

<table>

<tr>
<td>

## Events &emsp;*sent by the server*&emsp; to the client

##### CHILD

|Event                  |DataType     |
|:---------------------:|:-----------:|
|`'allGames'`           |`GameLobby[]`|
|`'gameOpened'`         |`GameLobby`  |
|`'gameUpdated'`        |`GameLobby`  | <!-- TODO : Making more granular events as childs don't need to have all the lobby info e.g 'gameNameUpdated', ... -->
|`'gameStarted'`        |`GameID`     |
|`'gameClosed'`         |`GameID`     |
|                       |             |
|`'openGame_SUCCESS'`   |`void`       | <!-- TODO : ... (see note below) -->
|`'tryJoinGame_SUCCESS'`|`void`       |
|`'tryJoinGame_FAILURE'`|`void`       |

<!--
NOTE : 'openGame_SUCCESS' is emitted when starting a solo game.
It was made w/o much reflexion as the feature of "solo games" was greatly needed.
Currently, failures are silently ignored.
TODO : Emitting failures
TODO : Using more precise name e.g 'tryStartSoloGame_SUCCESS' & 'tryStartSoloGame_FAILURE' as it's currently not clear that it's about solo game
--->
</td>

<td>

## Events &emsp;*sent by the client*&emsp; to the server

##### CHILD

|Event                 |DataType |
|:--------------------:|:-------:| 
|`'goBackHome'`        |`void`   |
|`'openGame'`          |`void`   | 
|`'tryJoinGame'`       |`GameID` |
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>

</td>
</tr>

<tr>
<td>

##### PLAYER

|Event                 |DataType                                                         |
|:--------------------:|:---------------------------------------------------------------:|
|`'gameUpdated'`       |`GameLobby`                                                      |
|`'startCountdown'`    |`void`                                                           |
|`'endCountdown'`      |`void`                                                           |
|`'gameStartup'`       |`any // Startup Package`                                         | <!-- TODO : Making a type alias e.g `type StartupPackage = unknown` -->
|`'newQuestion'`       |`Question`                                                       |
|`'playerChangedLane'` |`{playerId : UserID, x : number, y: number}`                     | <!-- TODO : Simplifying this event data type -->
|`'newProjectile'`     |`{playerId : UserID, projectile : Projectile}`                   | <!-- TODO : Renaming it to 'playerShot' -->
|`'enemyAdded'`        |`Enemy`                                                          | <!-- TODO : Renaming it to 'newEnemy' -->
|`'enemyHit'`          |`{projectile: Projectile, enemyId: EnemyID, enemyHealth: number}`| <!-- TODO : Simplifying this event -->
|`'enemyDespawned'`    |`Enemy`                                                          |
|`'playerParalysed'`   |`UserID`                                                         |
|`'playerDeparalysed'` |`UserID`                                                         |
|`'scoreUpdated'`      |`number`                                                         |
|`'playerScoreUpdated'`|`number`                                                         |
|`'healthUpdated'`     |`number`                                                         |
|`'newWave'`           |`number`                                                         |
|`'bossWave'`          |`string`                                                         |
|`'bossKilled'`        |`string`                                                         |
|`'gameEnded'`         |`void`                                                           |

</td>
<td>

##### PLAYER

|Event                 |DataType |
|:--------------------:|:-------:| 
|`'leaveGame'`         |`void`   |
|`'requestStartup'`    |`void`   |
|`'sendAnswer'`        |`Answer` | 
|`'changeLane'`        |`string` |
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>

<!-- 
 TODO : For now, this dataType is a string, but the only strings used here are UP and DOWN, maybe create a dedicated type for the directions 
 -->
</td>
</tr>
</table>



### ERGO & GAMEMASTER

<table>

<tr>
<td>

## Events &emsp;*sent by the server*&emsp; to the client

##### ERGO

|Event                            |DataType     |
|:-------------------------------:|:-----------:|
|`'allGames'`                     |`GameLobby[]`|
|`'gameOpened'`                   |`GameLobby`  |
|`'gameStarted'`                  |`GameID`     |
|`'gameClosed'`                   |`GameID`     |
|`'connectedUsersId'`             |`UserID[]`   |
|`'disconnectedUsersId'`          |`UserID[]`   |
|                                 |             |
|`'openGame_SUCCESS'`             |`void`       | <!-- TODO : ... (see note below) -->
|`'trySpyGame_SUCCESS'`           |`void`       |
|`'trySpyGame_FAILURE'`           |`void`       |
|`'tryForceDisconnection_SUCCESS'`|`void`       | <!-- TODO : Renaming it as 'tryUserForceDisconnection_SUCCESS' to emphasize that it's about disconnecting user -->
|`'tryForceDisconnection_FAILURE'`|`void`       | <!-- TODO : Renaming it as 'tryUserForceDisconnection_FAILURE' to emphasize that it's about disconnecting user -->


<!--
NOTE : 'openGame_SUCCESS' is emitted when starting a multiplayer game.
It was made w/o much reflexion as the feature of "multiplayer games" was greatly needed.
Currently, failures are silently ignored.
TODO : Emitting failures
TODO : Using more precise name e.g 'tryStartMultiplayerGame_SUCCESS' & 'tryStartMultiplayerGame_FAILURE' as it's currently not clear that it's about solo game
--->
</td>
<td>

## Events &emsp;*sent by the client*&emsp; to the server

##### ERGO

|Event                         |DataType     |
|:----------------------------:|:-----------:|
|``goBackHome``                |`void`       |
|`'requestConnectedUsersId'`   |`void`       |
|`'requestDisconnectedUsersId'`|`void`       |
|`'trySpyGame'`                |`GameID`     |
|`'updateGame'`                |`Game`       |
|`'openGame'`                  |`void`       |
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>


</td>
</tr>

<tr>
<td>

##### GAME_MASTER

|Event                |DataType     |
|:-------------------:|:-----------:|
|``gameUpdated``      |`GameLobby`  |
|`'startCountdown'`   |`void`       |
|`'endCountdown'`     |`void`       |

</td>

<td>

##### GAME_MASTER

|Event                         |DataType     |
|:----------------------------:|:-----------:|
|`'startGame'`                 |`void`       |
|`'closeGame'`                 |`void`       |
|`'unspyGame'`                 |`void`       |

</td>
</tr>

</table>
