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
import { MistakesBoxesComponent } from './components/mistakes-box/mistakes-boxes.component';

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

// Notification
import { NotifComponent } from './components/notif/notif.component';
import { NotifContainerComponent } from './components/notif-container/notif-container.component';

// Miscellaneous :
import { GradingLineComponent } from './components/grading-line/grading-line.component';
import { PlayerInLobbyComponent } from './components/player-in-lobby/player-in-lobby.component';
import { UserConfigComponent } from './components/user-config/user-config.component';
import { LobbyCardComponent } from './components/lobby-card/lobby-card.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';


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
    MistakesBoxesComponent,

    // Users :
    UserCardComponent,
    UserListComponent,

    // Settings :
    BigButtonComponent,
    SmallButtonComponent,
    SettingsSliderComponent,
    SettingsToggleComponent,

    // Notification :
    NotifComponent,
    NotifContainerComponent,

    // Miscellaneous :
    GradingLineComponent,
    PlayerInLobbyComponent,
    UserConfigComponent,
    LobbyCardComponent
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
