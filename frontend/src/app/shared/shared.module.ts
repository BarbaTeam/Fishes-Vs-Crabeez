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
import { PlayerInLobbyComponent } from './components/player-in-lobby/player-in-lobby.component';
import { UserConfigComponent } from './components/user-config/user-config.component';
import { GameCardComponent } from './components/game-card/game-card.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ChoiceButtonComponent } from './components/choice-button/choice-button.component';
import { ExpandableButtonComponent } from './components/expandable-button/expandable-button.component';


////////////////////////////////////////////////////////////////////////////////
// SharedModule :
////////////////////////////////////////////////////////////////////////////////

const socketConfig: SocketIoConfig = {
  url: 'http://localhost:9428',
  options: {
    transports: ['websocket'],
  },
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

    // Miscellaneous :
    PlayerInLobbyComponent,
    UserConfigComponent,
    GameCardComponent,
    ChoiceButtonComponent,
    ExpandableButtonComponent
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
