////////////////////////////////////////////////////////////////////////////////
// Imports :
////////////////////////////////////////////////////////////////////////////////

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { ChildRoutingModule } from './child-routing.module';


////////////////////////////////////////////////////////////////////////////////
// Pages :

import { JoiningGamesPageComponent } from './pages/joining-games-page/joining-games-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { GamesListPageComponent } from './pages/games-list-page/games-list-page.component';
import { GameComponent } from './pages/game/game.component';



////////////////////////////////////////////////////////////////////////////////
// ChildModule :
////////////////////////////////////////////////////////////////////////////////

const PAGES_COMPONENTS = [
    JoiningGamesPageComponent,
    SettingsPageComponent,
    ProfilePageComponent,
    GamesListPageComponent,
    GameComponent,
];



@NgModule({
    declarations: [
        ...PAGES_COMPONENTS,
    ],
    imports: [
        CommonModule,
        ChildRoutingModule,
        SharedModule,
    ],
    exports: [
        ...PAGES_COMPONENTS,
    ],
})
export class ChildModule {}
