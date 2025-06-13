////////////////////////////////////////////////////////////////////////////////
// Imports :
////////////////////////////////////////////////////////////////////////////////

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


////////////////////////////////////////////////////////////////////////////////
// Shared Components :

// Pages Template :
import { TemplateComponent } from './components/template/template.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BodyComponent } from './components/body/body.component';

// Boxes :
import { InnerBoxComponent } from './components/inner-box/inner-box.component';
import { SideBoxComponent } from './components/side-box/side-box.component';
import { RollableBoxComponent } from './components/rollable-box/rollable-box.component';

// Users :
import { UserCardComponent } from './components/user-card/user-card.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { StatefulUserCardComponent } from './components/stateful-user-card/stateful-user-card.component';
import { StatefulUsersListComponent } from './components/stateful-user-list/stateful-users-list.component';
import { NewChildButtonComponent } from './components/new-child-button/new-child-button.component';

// Inputs :
import { NavbarButtonComponent } from './components/navbar-button/navbar-button.component';
import { BigButtonComponent } from './components/big-button/big-button.component';
import { SmallButtonComponent } from './components/small-button/small-button.component';

// Setting :
import { SettingsSliderComponent } from './components/settings-slider/settings-slider.component';
import { SettingsToggleComponent } from './components/settings-toggle/settings-toggle.component';

// Statistics :
import { MistakesBoxComponent } from './components/mistakes-box/mistakes-box.component';
import { StatLineComponent } from './components/stat-line/stat-line.component';

// Notification
import { NotifComponent } from './components/notif/notif.component';
import { NotifContainerComponent } from './components/notif-container/notif-container.component';

// Miscellaneous :
import { PlayerInLeaderboardComponent } from './components/player-in-leaderboard/player-in-leaderboard.component';
import { PlayerInLobbyComponent } from './components/player-in-lobby/player-in-lobby.component';
import { UserConfigComponent } from './components/user-config/user-config.component';
import { GameCardComponent } from './components/game-card/game-card.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ChoiceButtonComponent } from './components/choice-button/choice-button.component';
import { InfoTooltipComponent } from './components/info-tooltip/info-tooltip.component';
import { FontSizeControlComponent } from './components/font-size-control/font-size-control.component';
import { SoundControlComponent } from './components/sound-control/sound-control.component';

////////////////////////////////////////////////////////////////////////////////
// SharedModule :
////////////////////////////////////////////////////////////////////////////////

const socketConfig: SocketIoConfig = {
<<<<<<< Updated upstream
    url: "http://localhost:9428",
    options: {
        transports: ['websocket'],
    },
=======
  url: 'http://localhost:9428',
  options: {
    transports: ['websocket'],
  },
>>>>>>> Stashed changes
};


const SHARED_COMPONENTS = [
    // Pages Template :
    TemplateComponent,
    NavbarComponent,
    BodyComponent,

    // Boxes :
    NavbarButtonComponent,
    InnerBoxComponent,
    SideBoxComponent,
    RollableBoxComponent,

    // Users :
    UserCardComponent,
    UserListComponent,
    StatefulUserCardComponent,
    StatefulUsersListComponent,
    NewChildButtonComponent,

    // Settings :
    BigButtonComponent,
    SmallButtonComponent,
    SettingsSliderComponent,
    SettingsToggleComponent,

    // Statistics :
    MistakesBoxComponent,
    StatLineComponent,

    // Notification :
    NotifComponent,
    NotifContainerComponent,

    // Configuration :
    InfoTooltipComponent,
    FontSizeControlComponent,
    SoundControlComponent,

    // Miscellaneous :
    PlayerInLeaderboardComponent,
    PlayerInLobbyComponent,
    UserConfigComponent,
    GameCardComponent,
    ChoiceButtonComponent,    
];



@NgModule({
    declarations: [
        ...SHARED_COMPONENTS,
    ],
    imports: [
        CommonModule,
        FormsModule,
        SocketIoModule.forRoot(socketConfig)
    ],
    exports: [
        ...SHARED_COMPONENTS,
        SocketIoModule
    ],
})
export class SharedModule {}
